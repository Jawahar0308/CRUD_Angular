import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [ngClass]="buttonColor"
      class="px-2 py-1 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
      [disabled]="disabled" 
      (click)="onClick()">
      {{ buttonLabel }}
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() disabled: boolean = true;
  @Input() buttonLabel: string = 'Save changes';
  @Input() buttonColor: string = 'bg-green-500 hover:bg-green-600';
  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }
}