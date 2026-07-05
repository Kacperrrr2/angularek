import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Criterion } from '../../data/triz';

export interface FormulationState {
  problem: string;
  criteria: Criterion[];
}

@Component({
  selector: 'app-problem-formulation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./problem-formulation.component.css'],
  template: `
    <div class="formulation-container">
      <section>
        <h3 class="section-title">Opis problemu</h3>
        <p class="section-desc">
          Opisz sprzeczność techniczną, którą chcesz rozwiązać.
        </p>
        <textarea
          [ngModel]="state.problem"
          (ngModelChange)="onProblemChange($event)"
          placeholder="np. Chcemy zmniejszyć masę ramienia robota, ale zachować jego sztywność przy obciążeniu…"
          rows="5"
          class="problem-textarea"
        ></textarea>
      </section>


    
      <section>
        <div class="criteria-header">
          <div>
            <h3 class="section-title">Kryteria oceny</h3>
            <p class="section-desc">
              Ustal wagi, według których ocenisz rozwiązania.
            </p>
          </div>
          <span
            class="criteria-sum"
            [ngClass]="totalWeight === 100 ? 'criteria-sum--valid' : 'criteria-sum--invalid'"
            >
            Σ {{ totalWeight }}%
          </span>
        </div>
        <div class="criteria-list">
          @for (c of state.criteria; track trackByCriterionId($index, c)) {
            <div
              class="criteria-item"
              >
              <span class="criteria-label">{{ c.label }}</span>
              <div class="criteria-input-group">
                <input
                  type="number"
                  min="0"
                  max="100"
                  [ngModel]="c.weight"
                  (ngModelChange)="onWeightChange(c.id, $event)"
                  class="criteria-input"
                  />
                <span class="criteria-percent">%</span>
              </div>
            </div>
          }
        </div>
        @if (totalWeight !== 100) {
          <p class="criteria-error">
            Wagi kryteriów muszą sumować się do 100%.
          </p>
        }
      </section>
    </div>
    `
})
export class ProblemFormulationComponent {
  @Input() state!: FormulationState;
  @Output() stateChange = new EventEmitter<Partial<FormulationState>>();

  get totalWeight(): number {
    return this.state.criteria.reduce((s, c) => s + c.weight, 0);
  }

  onProblemChange(problem: string) {
    this.stateChange.emit({ problem });
  }



  onWeightChange(id: string, weightStr: unknown) {
    const weight = Number(weightStr) || 0;
    const newCriteria = this.state.criteria.map((c) =>
      c.id === id ? { ...c, weight } : c
    );
    this.stateChange.emit({ criteria: newCriteria });
  }

  trackByCriterionId(index: number, c: Criterion) {
    return c.id;
  }
}
