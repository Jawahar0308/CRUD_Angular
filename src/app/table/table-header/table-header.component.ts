import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <colgroup>
      <col *ngFor="let col of columns; let i = index" [style.width]="i === 0 ? '50px' : 'auto'">
    </colgroup>
    <thead class="bg-gray-800 text-white">
      <tr>
        <th *ngFor="let column of columns; let i = index" 
            class="border border-gray-600 h-10"
            [ngClass]="{'text-center': i === 0, 'px-2': i !== 0}">
          <input *ngIf="i === 0" type="checkbox" class="h-4 w-4 text-blue-600">
          <span *ngIf="i !== 0">{{ column }}</span>
        </th>
      </tr>
    </thead>
  `,
  styles: [`
    :host {
      display: contents;
    }
    
    th {
      height: 40px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    
    input[type="checkbox"] {
      display: block;
      margin: 0 auto;
    }
  `]
})
export class TableHeaderComponent {
  @Input() columns: string[] = [];
}