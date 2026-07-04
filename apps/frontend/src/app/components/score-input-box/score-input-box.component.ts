import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-score-input-box',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./score-input-box.component.css'],
  template: `
    <div class="score-wrapper">
      <input
        type="number"
        min="0"
        max="10"
        [ngModel]="value"
        (ngModelChange)="onValueChange($event)"
        placeholder="—"
        class="score-input"
      />
      <span class="score-suffix">/10</span>
    </div>
  `
})
export class ScoreInputBoxComponent {
  @Input() value: number | null = null;
  @Output() valueChange = new EventEmitter<number | null>();

  onValueChange(raw: unknown) {
    if (raw === null || raw === '') {
      this.valueChange.emit(null);
      return;
    }
    const n = Math.max(0, Math.min(10, Number(raw)));
    this.valueChange.emit(n);
  }
}
