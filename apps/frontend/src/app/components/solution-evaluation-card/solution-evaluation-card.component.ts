import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideCheck } from '@lucide/angular';
import { INVENTIVE_PRINCIPLES, Solution } from '../../data/triz';

@Component({
  selector: 'app-solution-evaluation-card',
  standalone: true,
  imports: [CommonModule, LucideCheck],
  styleUrls: ['./solution-evaluation-card.component.css'],
  template: `
    <div class="eval-container">
      <div class="eval-card">
        <div class="eval-header">
          <svg lucideCheck class="eval-icon"></svg>
          <span class="eval-header-title">Wybrane rozwiązanie</span>
          <span class="eval-header-id">
            {{ solution.id }}
          </span>
        </div>
    
        @if (solution) {
          <div class="eval-content">
            <div class="eval-main-info">
              <div>
                <h2 class="eval-title">{{ solution.title }}</h2>
                <p class="eval-summary">{{ solution.summary }}</p>
              </div>
              <div class="eval-score-box">
                <div class="eval-score-value">
                  {{ score | number:'1.1-1' }}
                </div>
                <div class="eval-score-label">wynik ważony</div>
              </div>
            </div>
            <div>
              <div class="eval-section-title">
                Zastosowane zasady wynalazcze
              </div>
              <div class="eval-principles">
                @for (pid of solution.principleIds; track pid) {
                  <span class="eval-principle">
                    {{ pid }} · {{ inventivePrinciples[pid] ?? 'Zasada' }}
                  </span>
                }
              </div>
            </div>
            <div>
              <div class="eval-section-title">
                Uzasadnienie
              </div>
              <p class="eval-rationale">
                {{ solution.rationale }}
              </p>
            </div>
          </div>
        }
      </div>
    
      <button
        (click)="resetForm.emit()"
        class="eval-btn-reset"
        >
        Rozpocznij nową analizę
      </button>
    </div>
    `
})
export class SolutionEvaluationCardComponent {
  readonly inventivePrinciples = INVENTIVE_PRINCIPLES as Record<number, string | undefined>;

  @Input() solution!: Solution;
  @Input() score = 0;
  @Output() resetForm = new EventEmitter<void>();
}
