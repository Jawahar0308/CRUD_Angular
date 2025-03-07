import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-row',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <tbody>
      <tr *ngFor="let row of data" class="hover:bg-gray-100">
        <td *ngFor="let col of columns; let i = index" 
            class="border border-gray-300 h-10"
            [ngClass]="{'text-center': i === 0, 'p-0': i !== 0}">
          <input *ngIf="i === 0" type="checkbox" class="h-4 w-4 text-blue-600">
          <input *ngIf="i !== 0" 
                 type="text" 
                 [(ngModel)]="row[getPropertyPath(columnDataMapper[i-1])]" 
                 class="w-full h-full px-2 border-0 focus:outline-none">
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

  getPropertyPath(path: string): string {
    return path.split('.')[0];
  }

  getNestedValue(obj: any, path: string): any {
    if (!path) return '';

    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : '';
    }, obj);
  }
}