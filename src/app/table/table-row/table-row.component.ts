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
          <input [type]="getInputType(columnDataMapper[i-1])" 
               [ngModel]="formatValue(getNestedValue(row, columnDataMapper[i-1]))" 
               (ngModelChange)="updateNestedValue(row, columnDataMapper[i-1], $event, rowIndex, i-1)" 
               (focus)="onEdit()"
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
    
    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="number"] {
      background: transparent;
      box-sizing: border-box;
      transition: all 0.2s;
    }
    
    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="tel"]:focus,
    input[type="number"]:focus {
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
  @Input() isEditing: boolean = false;

  @Output() edit = new EventEmitter<void>();
  @Output() cellEdit = new EventEmitter<{ rowIndex: number, columnIndex: number, path: string, oldValue: any, newValue: any, isValid: boolean }>();
  @Output() rowSelectionChange = new EventEmitter<{ rowIndex: number, selected: boolean }>();

  onEdit() {
    this.edit.emit();
  }

  // Determine input type based on column path or name
  getInputType(path: string): string {
    if (!path) return 'text';

    if (path.includes('email')) {
      return 'email';
    } else if (path.includes('phone')) {
      return 'tel';
    } else if (path === 'id' || path.includes('userId')) {
      return 'number';
    } else {
      return 'text';
    }
  }

  getNestedValue(obj: any, path: string): any {
    if (!path) return '';

    const value = path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : null;
    }, obj);

    // For display purposes, handle special values
    if (value === null) {
      return this.isEditing ? '' : 'null';
    } else if (value === 'unknown' && !this.isEditing) {
      return 'unknown';
    }

    return value;
  }
  // Update in TableBodyComponent
  formatValue(value: any): string {
    // During editing, we want to show the raw values to the user
    // This will be updated after save
    if (value === null || value === undefined || value === '') {
      return '';  // Show empty input field for null values
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

    // Check if the value is valid based on column type
    const isValid = this.validateValue(path, value);

    // Store the raw value (format conversion happens only when saving)
    if (parent && last) {
      parent[last] = value;

      // Emit the change with validation info
      if (oldValue !== value) {
        this.cellEdit.emit({
          rowIndex,
          columnIndex,
          path,
          oldValue,
          newValue: value,
          isValid
        });
      }
    }
  }
  // Validate the value based on the column type
  validateValue(path: string, value: any): boolean {
    if (value === null || value === '' || value === undefined) {
      return false;
    }

    if (path.includes('email')) {
      // Simple email validation
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (path.includes('phone')) {
      // Simple phone validation (allow digits, spaces, dashes, parentheses)
      return /^[0-9\s\-\(\)\.]+$/.test(value);
    } else if (path === 'id' || path.includes('userId')) {
      // Number validation
      return !isNaN(Number(value));
    }

    return true;
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