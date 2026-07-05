import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavTabsRdComponent, StepDef } from './components/nav-tabs-rd/nav-tabs-rd.component';
import { ProblemFormulationComponent, FormulationState } from './components/problem-formulation/problem-formulation.component';
import { MorphologicalMatrixTableComponent } from './components/morphological-matrix-table/morphological-matrix-table.component';
import { SolutionEvaluationCardComponent } from './components/solution-evaluation-card/solution-evaluation-card.component';
import { DEFAULT_CRITERIA, Solution } from './data/triz';
import { SolveResult, SolveService } from './services/solve.service';
import { LucideArrowLeft, LucideArrowRight } from '@lucide/angular';

const STEPS: StepDef[] = [
  { id: 1, label: 'Formulacja problemu' },
  { id: 2, label: 'Przestrzeń rozwiązań' },
];

@Component({
  imports: [
    CommonModule, 
    NavTabsRdComponent, 
    ProblemFormulationComponent, 
    MorphologicalMatrixTableComponent, 
    SolutionEvaluationCardComponent,
    LucideArrowLeft,
    LucideArrowRight
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly STEPS = STEPS;


  step = 1;
  furthestUnlocked = 1;
  selectedId: string | null = null;
  generatedSolutions: Solution[] = [];

  formulation: FormulationState = {
    problem: '',
    criteria: JSON.parse(JSON.stringify(DEFAULT_CRITERIA)),
  };

  scores: Record<string, number | null> = {};

  solving = signal(false);
  solveError = signal<string | null>(null);
  solveResult = signal<SolveResult | null>(null);

  private readonly solveService = inject(SolveService);

  get weightSum(): number {
    return this.formulation.criteria.reduce((s, c) => s + c.weight, 0);
  }

  get step1Valid(): boolean {
    return (
      this.formulation.problem.trim().length > 0 &&
      this.weightSum === 100
    );
  }

  get scoredCount(): number {
    return Object.keys(this.scores).filter((k) => typeof this.scores[k] === 'number').length;
  }

  get step2Valid(): boolean {
    return this.generatedSolutions.length > 0 && this.scoredCount === this.generatedSolutions.length;
  }

  get selectedSolution(): Solution | undefined {
    return this.generatedSolutions.find((s) => s.id === this.selectedId);
  }

  onFormulationChange(patch: Partial<FormulationState>) {
    this.formulation = { ...this.formulation, ...patch };
  }

  onScoreChange(event: { id: string; value: number | null }) {
    this.scores = { ...this.scores, [event.id]: event.value };
  }

  setStep(id: number) {
    if (!this.selectedSolution) {
      this.step = id;
    }
  }

  goToStep2() {
    if (!this.step1Valid) return;
    this.furthestUnlocked = Math.max(this.furthestUnlocked, 2);
    this.step = 2;

    this.solving.set(true);
    this.solveError.set(null);
    this.solveResult.set(null);

    this.solveService.solve(this.formulation.problem).subscribe({
      next: (result) => {
        this.solveResult.set(result);
        
        this.generatedSolutions = [];
        result.triz.forEach((r, i) => {
          this.generatedSolutions.push({
            id: `TRIZ-${i + 1}`,
            title: `TRIZ Koncepcja ${i + 1}`,
            summary: 'Rozwiązanie oparte na zasadach TRIZ',
            rationale: r.response,
            principleIds: r.principles?.map(p => p.id) || []
          });
        });
        result.scamper.forEach((r, i) => {
          this.generatedSolutions.push({
            id: `SCAMPER-${i + 1}`,
            title: `SCAMPER Koncepcja ${i + 1}`,
            summary: 'Rozwiązanie wygenerowane heurystyką SCAMPER',
            rationale: r.response,
            principleIds: []
          });
        });

        this.solving.set(false);
      },
      error: () => {
        this.solveError.set('Nie udało się wygenerować rozwiązań. Sprawdź, czy backend działa.');
        this.solving.set(false);
      },
    });
  }

  selectBest() {
    if (!this.step2Valid) return;
    const best = [...this.generatedSolutions].sort(
      (a, b) => (this.scores[b.id] ?? 0) - (this.scores[a.id] ?? 0)
    )[0];
    this.selectedId = best.id;
  }

  reset() {
    this.step = 1;
    this.furthestUnlocked = 1;
    this.selectedId = null;
    this.scores = {};
    this.generatedSolutions = [];
    this.formulation = {
      problem: '',
      criteria: JSON.parse(JSON.stringify(DEFAULT_CRITERIA)),
    };
    this.solving.set(false);
    this.solveError.set(null);
    this.solveResult.set(null);
  }
}
