// src/app/table/table-row/table-row.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-row',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <tbody class="w-full" style=" overflow-y: auto;">
      <tr *ngFor="let row of data; let rowIndex = index" class="hover:bg-gray-100">
        <td *ngFor="let col of columns; let i = index" 
            class="border border-gray-300 h-10"
            [ngClass]="{'text-center': i === 0, 'p-0': i !== 0}">
          <input *ngIf="i === 0" type="checkbox" class="h-4 w-4 text-blue-600">
          <div *ngIf="i !== 0" class="w-full h-full">
            <input type="text" 
                 [ngModel]="getNestedValue(row, columnDataMapper[i-1])" 
                 (ngModelChange)="updateNestedValue(row, columnDataMapper[i-1], $event, rowIndex, i-1)" 
                 (click)="onEdit()"
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
    }
  `]
})
export class TableBodyComponent {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() columnDataMapper: string[] = [];
  @Output() edit = new EventEmitter<void>();
  @Output() cellEdit = new EventEmitter<{ rowIndex: number, columnIndex: number, path: string, oldValue: any, newValue: any }>();

  onEdit() {
    this.edit.emit();
  }

  getNestedValue(obj: any, path: string): any {
    if (!path) return '';

    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : '';
    }, obj);
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
}