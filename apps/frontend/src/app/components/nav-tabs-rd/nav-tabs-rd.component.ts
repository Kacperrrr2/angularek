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
      <button
        *ngFor="let step of steps"
        [disabled]="step.id > furthestUnlocked"
        (click)="onSelect.emit(step.id)"
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
          <svg *ngIf="step.id < furthestUnlocked" lucideCheck class="nav-step-icon"></svg>
          <ng-container *ngIf="step.id >= furthestUnlocked">{{ step.id }}</ng-container>
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
    </nav>
  `
})
export class NavTabsRdComponent {
  @Input() steps: StepDef[] = [];
  @Input() current: number = 1;
  @Input() furthestUnlocked: number = 1;
  @Output() onSelect = new EventEmitter<number>();
}
