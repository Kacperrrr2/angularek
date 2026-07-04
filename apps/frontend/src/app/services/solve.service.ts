import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface TrizPrinciple {
  id: number;
  name: string;
  description: string;
}

export interface AgentResponse {
  response: string;
  principles?: TrizPrinciple[];
}

export interface SolveResult {
  id: string;
  problemDescription: string;
  advice: string;
  triz: AgentResponse[];
  scamper: AgentResponse[];
}

@Injectable({ providedIn: 'root' })
export class SolveService {
  private readonly baseUrl = 'http://localhost:3000/api';
  private readonly http = inject(HttpClient);

  solve(problemDescription: string) {
    return this.http.post<SolveResult>(`${this.baseUrl}/solve`, { problemDescription });
  }
}
