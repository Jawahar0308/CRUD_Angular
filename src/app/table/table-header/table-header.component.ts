import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <colgroup>
      <col *ngFor="let col of columns; let i = index" [style.width]="i === 0 ? '50px' : 'auto'">
    </colgroup>
    <thead class="bg-gray-800 text-white sticky top-0 z-10">
      <tr>
        <th *ngFor="let column of columns; let i = index" 
            class="border border-gray-600 whitespace-nowrap pb-2"
            [ngClass]="{'text-center': i === 0, 'px-2': i !== 0}">
          <input *ngIf="i === 0" 
                 type="checkbox" 
                 [checked]="isAllSelected"
                 (change)="toggleSelectAll($event)" 
                 class="h-4 w-4 text-blue-600">
          <div *ngIf="i !== 0" class="flex flex-col">
            <div class="flex items-center justify-between py-1">
              <span title="{{column}}">{{ column }}</span>
              <div *ngIf="i !== 0" class="cursor-pointer ml-1" (click)="sort(column)">
                <span *ngIf="sortColumn !== column">⇅</span>
                <span *ngIf="sortColumn === column && sortDirection === 'asc'">↑</span>
                <span *ngIf="sortColumn === column && sortDirection === 'desc'">↓</span>
              </div>
            </div>
            <!-- Filter input for each column -->
            <input 
              *ngIf="i !== 0"
              type="text" 
              [placeholder]="'Filter ' + column"
              (input)="onColumnFilter(i, $event)"
              class="bg-gray-700 text-white text-sm px-2 py-1 w-full border-t border-gray-600 rounded-none"
            />
          </div>
        </th>
      </tr>
    </thead>
  `,
  styles: [`
    :host {
      display: contents;
    }
    
    th {
      height: auto;
      overflow: hidden;
    }
    
    input[type="checkbox"] {
      display: block;
      margin: 0 auto;
      cursor: pointer;
    }
    
    input[type="text"] {
      outline: none;
    }
    
    input[type="text"]:focus {
      background-color: #4B5563;
    }
  `]
})
export class TableHeaderComponent {
  @Input() columns: string[] = [];
  @Input() isAllSelected: boolean = false;
  @Input() sortColumn: string = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  @Output() selectAllChange = new EventEmitter<boolean>();
  @Output() sortChange = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();
  @Output() columnFilterChange = new EventEmitter<{ columnIndex: number, value: string }>();

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectAllChange.emit(isChecked);
  }

  sort(column: string) {
    let direction: 'asc' | 'desc' = 'asc';

    if (this.sortColumn === column) {
      // Toggle direction
      direction = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }

    this.sortChange.emit({ column, direction });
  }

  onColumnFilter(columnIndex: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.columnFilterChange.emit({ columnIndex, value });
  }
}