import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideCheck } from '@lucide/angular';

export interface StepDef {
  id: number;
  label: string;
}

@Component({
  selector: 'app-nav-tabs-rd',
  standalone: true,
  imports: [CommonModule, LucideCheck],
  styleUrls: ['./nav-tabs-rd.component.css'],
  template: `
    <nav class="nav-tabs">
      @for (step of steps; track step) {
        <button
          [disabled]="step.id > furthestUnlocked"
          (click)="selectTab.emit(step.id)"
          class="nav-step"
          >
          <span
            class="nav-step-circle"
          [ngClass]="{
            'nav-step-circle--current': step.id === current,
            'nav-step-circle--completed': step.id !== current && step.id < furthestUnlocked,
            'nav-step-circle--future': step.id !== current && step.id >= furthestUnlocked
          }"
            >
            @if (step.id < furthestUnlocked) {
              <svg lucideCheck class="nav-step-icon"></svg>
            }
            @if (step.id >= furthestUnlocked) {
              {{ step.id }}
            }
          </span>
          <span
            class="nav-step-label"
          [ngClass]="{
            'nav-step-label--current': step.id === current,
            'nav-step-label--locked': step.id > furthestUnlocked,
            'nav-step-label--unlocked': step.id !== current && step.id <= furthestUnlocked
          }"
            >
            {{ step.label }}
          </span>
        </button>
      }
    </nav>
    `
})
export class NavTabsRdComponent {
  @Input() steps: StepDef[] = [];
  @Input() current = 1;
  @Input() furthestUnlocked = 1;
  @Output() selectTab = new EventEmitter<number>();
}
