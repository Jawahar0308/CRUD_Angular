import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <thead class="bg-gray-800 text-white sticky top-0 z-10">
      <tr>
        <th *ngFor="let column of columns" class="px-4 py-2 text-left whitespace-nowrap">{{ column }}</th>
      </tr>
    </thead>
  `,
  styles: [`
    :host {
      display: table-header-group;
      width: 100%;
    }
  `]
})
export class TableHeaderComponent {
  @Input() columns: string[] = [];
}