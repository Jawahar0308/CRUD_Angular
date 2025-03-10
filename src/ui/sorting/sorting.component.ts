import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sort',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center space-x-2">
      <select 
        [(ngModel)]="selectedColumn"
        (change)="onColumnSelect()" 
        class="px-2 py-2 border rounded-md">
        <option value="">Sort by</option>
        <option *ngFor="let column of columns" [value]="column">{{ column }}</option>
      </select>
      
      <button 
        *ngIf="selectedColumn"
        (click)="toggleDirection()" 
        class="p-2 border rounded-md hover:bg-gray-100"
        [title]="direction === 'asc' ? 'Ascending' : 'Descending'">
        <span *ngIf="direction === 'asc'">↑</span>
        <span *ngIf="direction === 'desc'">↓</span>
      </button>
    </div>
  `,
  styles: []
})
export class SortComponent {
  @Input() columns: string[] = [];
  @Output() sortChange = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();

  selectedColumn: string = '';
  direction: 'asc' | 'desc' = 'asc';

  onColumnSelect() {
    if (this.selectedColumn) {
      this.sortChange.emit({
        column: this.selectedColumn,
        direction: this.direction
      });
    }
  }

  toggleDirection() {
    this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    if (this.selectedColumn) {
      this.sortChange.emit({
        column: this.selectedColumn,
        direction: this.direction
      });
    }
  }
}