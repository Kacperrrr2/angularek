import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideChevronRight } from '@lucide/angular';
import { ScoreInputBoxComponent } from '../score-input-box/score-input-box.component';
import { INVENTIVE_PRINCIPLES, MOCK_SOLUTIONS, Solution } from '../../data/triz';

@Component({
  selector: 'app-morphological-matrix-table',
  standalone: true,
  imports: [CommonModule, LucideChevronRight, ScoreInputBoxComponent],
  styleUrls: ['./morphological-matrix-table.component.css'],
  template: `
    <div class="matrix-container">
      <div class="matrix-header">
        <span class="matrix-col-id">ID</span>
        <h4 class="matrix-col-title">Koncepcja rozwiązania</h4>
        <span class="matrix-col-score">Ocena</span>
      </div>

      <ul class="matrix-list">
        <li *ngFor="let s of mockSolutions" class="matrix-item">
          <div class="matrix-row">
            <span class="matrix-id">{{ s.id }}</span>
            <div class="matrix-concept">
              <div class="matrix-concept-title">{{ s.title }}</div>
              <div class="matrix-concept-meta">
                <span *ngFor="let pid of s.principleIds" class="matrix-tag">
                  #{{ pid }}
                </span>
                <button
                  (click)="toggleExpand(s.id)"
                  class="matrix-btn-expand"
                >
                  <svg lucideChevronRight
                    class="matrix-icon"
                    [ngClass]="{ 'matrix-icon--expanded': expanded === s.id }"
                  ></svg>
                  Wyświetl uzasadnienie
                </button>
              </div>
            </div>
            <div class="matrix-score">
              <app-score-input-box
                [value]="scores[s.id] ?? null"
                (valueChange)="onScoreChange(s.id, $event)"
              ></app-score-input-box>
            </div>
          </div>

          <div *ngIf="expanded === s.id" class="matrix-details">
            <p class="matrix-rationale">{{ s.rationale }}</p>
            <div class="matrix-principles">
              <span *ngFor="let pid of s.principleIds" class="matrix-principle">
                {{ pid }} · {{ inventivePrinciples[pid] ?? 'Zasada' }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `
})
export class MorphologicalMatrixTableComponent {
  readonly mockSolutions = MOCK_SOLUTIONS;
  readonly inventivePrinciples = INVENTIVE_PRINCIPLES as Record<number, string | undefined>;

  @Input() scores: Record<string, number | null> = {};
  @Output() scoreChange = new EventEmitter<{ id: string; value: number | null }>();

  expanded: string | null = null;

  toggleExpand(id: string) {
    this.expanded = this.expanded === id ? null : id;
  }

  onScoreChange(id: string, value: number | null) {
    this.scoreChange.emit({ id, value });
  }
}
