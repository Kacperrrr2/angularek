import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavTabsRdComponent, StepDef } from './components/nav-tabs-rd/nav-tabs-rd.component';
import { ProblemFormulationComponent, FormulationState } from './components/problem-formulation/problem-formulation.component';
import { MorphologicalMatrixTableComponent } from './components/morphological-matrix-table/morphological-matrix-table.component';
import { SolutionEvaluationCardComponent } from './components/solution-evaluation-card/solution-evaluation-card.component';
import { DEFAULT_CRITERIA, MOCK_SOLUTIONS, Solution } from './data/triz';
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
  readonly MOCK_SOLUTIONS = MOCK_SOLUTIONS;

  step = 1;
  furthestUnlocked = 1;
  selectedId: string | null = null;

  formulation: FormulationState = {
    problem: '',
    improve: null,
    worsen: null,
    criteria: JSON.parse(JSON.stringify(DEFAULT_CRITERIA)),
  };

  scores: Record<string, number | null> = {};

  get weightSum(): number {
    return this.formulation.criteria.reduce((s, c) => s + c.weight, 0);
  }

  get step1Valid(): boolean {
    return (
      this.formulation.problem.trim().length > 0 &&
      this.formulation.improve !== null &&
      this.formulation.worsen !== null &&
      this.weightSum === 100
    );
  }

  get scoredCount(): number {
    return this.MOCK_SOLUTIONS.filter((s) => typeof this.scores[s.id] === 'number').length;
  }

  get step2Valid(): boolean {
    return this.scoredCount === this.MOCK_SOLUTIONS.length;
  }

  get selectedSolution(): Solution | undefined {
    return this.MOCK_SOLUTIONS.find((s) => s.id === this.selectedId);
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
  }

  selectBest() {
    if (!this.step2Valid) return;
    const best = [...this.MOCK_SOLUTIONS].sort(
      (a, b) => (this.scores[b.id] ?? 0) - (this.scores[a.id] ?? 0)
    )[0];
    this.selectedId = best.id;
  }

  reset() {
    this.step = 1;
    this.furthestUnlocked = 1;
    this.selectedId = null;
    this.scores = {};
    this.formulation = {
      problem: '',
      improve: null,
      worsen: null,
      criteria: JSON.parse(JSON.stringify(DEFAULT_CRITERIA)),
    };
  }
}
