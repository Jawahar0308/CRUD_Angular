import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sort',
  template: `
    <select (change)="onSortChange($event.target.value)" class="px-2 py-1 border rounded">
      <option value="">Sort by</option>
      <option *ngFor="let column of columns" [value]="column">{{ column }}</option>
    </select>
  `,
  styles: []
})
export class SortComponent {
  @Input() columns: string[] = [];
  @Output() sortChange = new EventEmitter<string>();

  onSortChange(value: string) {
    this.sortChange.emit(value);
  }
}