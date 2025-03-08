import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  template: `
    <input
      type="text"
      placeholder="Search..."
      (input)="onFilterChange($event.target.value)"
      class="px-2 py-1 border rounded"
    />
  `,
  styles: []
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<string>();

  onFilterChange(value: string) {
    this.filterChange.emit(value);
  }
}