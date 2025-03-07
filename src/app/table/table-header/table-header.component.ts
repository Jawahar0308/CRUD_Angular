import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <thead class="bg-gray-800 text-white sticky top-0 z-10">
      <tr>
        <th *ngFor="let column of columns" class="px-4 py-2 text-left whitespace-nowrap border border-gray-600">{{ column }}</th>
      </tr>
    </thead>
  `,
  styles: [`
    :host {
      display: table-header-group;
      width: 100%;
    }
    
    th {
      border: 1px solid #4b5563;
    }
  `]
})
export class TableHeaderComponent {
  @Input() columns: string[] = [];
}