import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputCellComponent } from "../../../ui/input-cell/input-cell.component";

@Component({
  selector: 'app-table-row',
  standalone: true,
  imports: [CommonModule, InputCellComponent],
  template: `
    <tbody class="bg-white divide-y divide-gray-200">
      <tr *ngFor="let row of data" class="hover:bg-gray-100">
        <td *ngFor="let col of columns; let i = index" class="px-4 py-2 border border-gray-300">
          <app-input-cell [value]="getNestedValue(row, columnDataMapper[i])" class="w-full block"></app-input-cell>
        </td>
      </tr>
    </tbody>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    td {
      border: 1px solid #d1d5db;
    }
  `]
})
export class TableBodyComponent {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() columnDataMapper: string[] = [];

  getNestedValue(obj: any, path: string): any {
    if (!path) return '';

    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : '';
    }, obj);
  }
}