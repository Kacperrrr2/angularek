import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contradiction } from './contradiction.entity';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';

const RESPONSES_PER_AGENT = 3;

interface AgentRunResult {
  sessionId: string;
  response: string;
}

interface TrizPrinciple {
  id: number;
  name: string;
  description: string;
}

// Cheap, on-the-fly metadata parsing: check if the AI response mentioned any standard TRIZ
// principles. This allows us to keep the database logging simple, yet highly structured.
const TRIZ_PRINCIPLE_KEYWORDS: Array<{ match: string[]; principle: TrizPrinciple }> = [
  {
    match: ['principle 10', 'prior action'],
    principle: { id: 10, name: 'Prior Action', description: 'Perform the required change of an object before it is needed.' },
  },
  {
    match: ['principle 2', 'taking out'],
    principle: { id: 2, name: 'Taking Out', description: 'Separate the troublesome part/property from the object.' },
  },
  {
    match: ['principle 26', 'copying'],
    principle: { id: 26, name: 'Copying', description: 'Use a simpler/cheaper copy instead of an expensive/fragile object.' },
  },
  {
    match: ['principle 35', 'parameter changes'],
    principle: { id: 35, name: 'Parameter Changes', description: 'Change physical state, concentration, density, temperature, or volume.' },
  },
];

@Injectable()
export class AppService {
  private adkAgentUrl = process.env['ADK_AGENT_URL'] || 'http://localhost:8081';

  constructor(
    @InjectRepository(Contradiction)
    private readonly contradictionRepo: Repository<Contradiction>,
    private readonly httpService: HttpService
  ) {}

  // ==========================================
  // Conversational Solving & Contradictions
  // ==========================================
  async solveContradiction(dto: { problemDescription: string }) {
    const guestUserId = 'guest-user';

    // Ask the same underlying agent app for several independent takes on the problem: three
    // grounded in the TRIZ MCP server and three grounded in the SCAMPER MCP server.
    const [trizRuns, scamperRuns] = await Promise.all([
      this.runAgentMultipleTimes('triz_agent', guestUserId, dto.problemDescription, RESPONSES_PER_AGENT),
      this.runAgentMultipleTimes('scamper_agent', guestUserId, dto.problemDescription, RESPONSES_PER_AGENT),
    ]);

    const triz = trizRuns.map((run) => ({
      response: run.response,
      principles: this.extractTrizPrinciples(run.response),
    }));
    const scamper = scamperRuns.map((run) => ({ response: run.response }));

    const combinedPrinciples = triz.flatMap((r) => r.principles);

    // Store the contradiction and both sets of solved advice directly in Cloud SQL
    const saved = await this.contradictionRepo.save(
      this.contradictionRepo.create({
        problemDescription: dto.problemDescription,
        principles: combinedPrinciples,
        advice: this.formatCombinedAdvice(triz, scamper),
      })
    );

    return { ...saved, triz, scamper };
  }

  async getHistory() {
    return this.contradictionRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async rateSolution(id: string, rating: number) {
    await this.contradictionRepo.update(id, { rating });
    return this.contradictionRepo.findOneBy({ id });
  }

  // ==========================================
  // ADK agent invocation helpers
  // ==========================================
  private async runAgentMultipleTimes(
    appName: string,
    userId: string,
    problemDescription: string,
    count: number
  ): Promise<AgentRunResult[]> {
    // Each attempt gets its own fresh session so the three responses are independent
    // samples rather than turns of one growing conversation.
    const attempts = Array.from({ length: count }, () =>
      this.runAgent(appName, userId, randomUUID(), problemDescription)
    );
    return Promise.all(attempts);
  }

  private async runAgent(
    appName: string,
    userId: string,
    sessionId: string,
    problemDescription: string
  ): Promise<AgentRunResult> {
    // Automatically pre-initialize the session in the ADK agent if it does not exist
    const sessionInitUrl = `${this.adkAgentUrl}/apps/${appName}/users/${userId}/sessions/${sessionId}`;
    try {
      await firstValueFrom(this.httpService.post(sessionInitUrl, {}));
    } catch {
      // Safe to ignore if session already exists
    }

    const requestPayload = {
      appName,
      userId,
      sessionId,
      newMessage: {
        role: 'user',
        parts: [{ text: problemDescription }],
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.adkAgentUrl}/run`, requestPayload)
      );

      const events = response.data;
      if (Array.isArray(events) && events.length > 0) {
        // Find the last event returned by the model to extract the finalized response text
        const modelEvent = [...events].reverse().find(
          (evt: any) => evt.content?.role === 'model' || evt.author === 'root_agent'
        );

        if (modelEvent?.content?.parts?.[0]?.text) {
          return { sessionId, response: modelEvent.content.parts[0].text };
        }
        return { sessionId, response: JSON.stringify(events) };
      }
      return { sessionId, response: JSON.stringify(response.data) };
    } catch (error: any) {
      console.error(`Error invoking ADK agent "${appName}":`, error.message);
      if (error.response?.data) {
        console.error('ADK detailed error payload:', JSON.stringify(error.response.data));
      }
      return {
        sessionId,
        response: `Failed to contact the AI problem solver "${appName}". (Error: ${error.message}). Please ensure the ADK Agent API is running and configured correctly.`,
      };
    }
  }

  private extractTrizPrinciples(agentAdvice: string): TrizPrinciple[] {
    const lowerAdvice = agentAdvice.toLowerCase();
    return TRIZ_PRINCIPLE_KEYWORDS.filter(({ match }) =>
      match.some((keyword) => lowerAdvice.includes(keyword))
    ).map(({ principle }) => principle);
  }

  private formatCombinedAdvice(
    triz: Array<{ response: string }>,
    scamper: Array<{ response: string }>
  ): string {
    const trizSection = triz
      .map((r, i) => `TRIZ response ${i + 1}:\n${r.response}`)
      .join('\n\n');
    const scamperSection = scamper
      .map((r, i) => `SCAMPER response ${i + 1}:\n${r.response}`)
      .join('\n\n');
    return `${trizSection}\n\n${scamperSection}`;
  }
}
