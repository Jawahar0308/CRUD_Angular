// src/app/table/table-row/table-row.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-row',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <tbody class="w-full" style="overflow-y: auto;">
    <tr *ngFor="let row of data; let rowIndex = index" class="hover:bg-gray-100">
      <td *ngFor="let col of columns; let i = index" 
          class="border border-gray-300 h-10"
          [ngClass]="{'text-center': i === 0, 'p-0': i !== 0}">
        <input *ngIf="i === 0" 
               type="checkbox" 
               [checked]="isRowSelected(rowIndex)"
               (change)="onRowCheckboxChange(rowIndex, $event)" 
               class="h-4 w-4 text-blue-600">
        <div *ngIf="i !== 0" class="w-full h-full">
          <input type="text" 
               [ngModel]="formatValue(getNestedValue(row, columnDataMapper[i-1]))"  (focus)="startEdit.emit()" 
               (ngModelChange)="updateNestedValue(row, columnDataMapper[i-1], $event, rowIndex, i-1)" 
               class="w-full h-full px-2 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded">
        </div>
      </td>
    </tr>
  </tbody>
`,
  styles: [`
    :host {
      display: contents;
    }
    
    td {
      height: 40px;
      padding: 0;
    }
    
    input[type="text"] {
      background: transparent;
      box-sizing: border-box;
      transition: all 0.2s;
    }
    
    input[type="text"]:focus {
      border: 1px solid #3b82f6;
    }
    
    input[type="checkbox"] {
      display: block;
      margin: 0 auto;
      cursor: pointer;
    }
  `]
})
export class TableBodyComponent {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() columnDataMapper: string[] = [];
  @Input() selectedRows: Set<number> = new Set();
  @Input() isEditing: boolean = false; // Add this to receive editing state from parent

  @Output() edit = new EventEmitter<void>();
  @Output() cellEdit = new EventEmitter<{ rowIndex: number, columnIndex: number, path: string, oldValue: any, newValue: any }>();
  @Output() rowSelectionChange = new EventEmitter<{ rowIndex: number, selected: boolean }>();
  @Output() startEdit = new EventEmitter<void>(); // Add this for focus event

  getNestedValue(obj: any, path: string): any {
    if (!path) return '';

    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : '';
    }, obj);
  }

  // Format the value for display - show "null" for null values
  formatValue(value: any): string {
    if (value === null) {
      return 'null';
    }
    return value;
  }

  updateNestedValue(obj: any, path: string, value: any, rowIndex: number, columnIndex: number): void {
    if (!path) return;

    const oldValue = this.getNestedValue(obj, path);
    const parts = path.split('.');
    const last = parts.pop();

    // Navigate to the parent object
    const parent = parts.reduce((prev, curr) => {
      if (!prev[curr]) prev[curr] = {};
      return prev[curr];
    }, obj);

    // Update the value
    if (parent && last) {
      parent[last] = value;

      // Emit the change if the value is actually different
      if (oldValue !== value) {
        this.cellEdit.emit({
          rowIndex,
          columnIndex,
          path,
          oldValue,
          newValue: value
        });
      }
    }
  }

  // Methods for checkbox selection
  isRowSelected(rowIndex: number): boolean {
    return this.selectedRows.has(rowIndex);
  }

  onRowCheckboxChange(rowIndex: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowSelectionChange.emit({ rowIndex, selected: isChecked });
  }
}