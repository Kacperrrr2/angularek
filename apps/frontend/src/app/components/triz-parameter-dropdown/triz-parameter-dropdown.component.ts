import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideChevronDown } from '@lucide/angular';
import { TRIZ_PARAMETERS, TrizParameter } from '../../data/triz';

@Component({
  selector: 'app-triz-parameter-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideChevronDown],
  styleUrls: ['./triz-parameter-dropdown.component.css'],
  template: `
    <div class="dropdown-container">
      <div class="dropdown-header">
        <span class="dropdown-indicator" [style.backgroundColor]="accent"></span>
        <span class="dropdown-label">{{ label }}</span>
      </div>
    
      <button
        (click)="toggleOpen()"
        class="dropdown-button"
        >
        <span class="dropdown-value">
          @if (value) {
            <span class="dropdown-value-selected">
              <span [style.color]="accent">{{ value.id }}</span>
              &nbsp;&nbsp;{{ value.name }}
            </span>
          }
          @if (!value) {
            <span class="dropdown-value-placeholder">Wybierz parametr…</span>
          }
        </span>
        <svg lucideChevronDown class="dropdown-icon" [ngClass]="{ 'dropdown-icon--open': open }"></svg>
      </button>
    
      @if (open) {
        <div class="dropdown-menu">
          <div class="dropdown-search-wrapper">
            <input
              #searchInput
              [ngModel]="query"
              (ngModelChange)="onQueryChange($event)"
              placeholder="Filtruj z macierzy 39×39…"
              class="dropdown-search-input"
              />
          </div>
          <ul class="dropdown-list">
            @for (p of filteredOptions; track p) {
              <li>
                <button
                  (click)="selectOption(p)"
                  class="dropdown-option"
                  >
                  <span class="dropdown-option-id" [style.color]="accent">{{ p.id }}</span>
                  <span class="dropdown-option-name">{{ p.name }}</span>
                </button>
              </li>
            }
            @if (filteredOptions.length === 0) {
              <li class="dropdown-empty">
                Brak dopasowań
              </li>
            }
          </ul>
        </div>
      }
    </div>
    `
})
export class TrizParameterDropdownComponent {
  readonly parameters = TRIZ_PARAMETERS;

  @Input() label!: string;
  @Input() accent!: string;
  @Input() value: TrizParameter | null = null;
  @Input() exclude: number | null = null;
  @Output() valueChange = new EventEmitter<TrizParameter>();

  open = false;
  query = '';
  options: TrizParameter[] = TRIZ_PARAMETERS;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private eRef = inject(ElementRef);

  get filteredOptions(): TrizParameter[] {
    return this.options.filter(
      (p) => p.id !== this.exclude && p.name.toLowerCase().includes(this.query.toLowerCase())
    );
  }

  toggleOpen() {
    this.open = !this.open;
    if (this.open) {
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.nativeElement.focus();
        }
      }, 0);
    }
  }

  onQueryChange(newQuery: string) {
    this.query = newQuery;
  }

  selectOption(p: TrizParameter) {
    this.valueChange.emit(p);
    this.open = false;
    this.query = '';
  }

  @HostListener('document:mousedown', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.open = false;
    }
  }
}
