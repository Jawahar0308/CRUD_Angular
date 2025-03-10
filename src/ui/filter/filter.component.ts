import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <input
        type="text"
        [(ngModel)]="filterText"
        placeholder="Search all columns..."
        (input)="onFilterChange()"
        class="px-3 py-2 border rounded-md pl-8 w-64"
      />
      <span class="absolute left-2 top-2 text-gray-400">
        <!-- Search icon (you can use an actual icon library in your project) -->
        🔍
      </span>
      <button 
        *ngIf="filterText"
        (click)="clearFilter()" 
        class="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
        ✕
      </button>
    </div>
  `,
  styles: []
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<string>();
  filterText: string = '';

  onFilterChange() {
    this.filterChange.emit(this.filterText);
  }

  clearFilter() {
    this.filterText = '';
    this.filterChange.emit('');
  }
}