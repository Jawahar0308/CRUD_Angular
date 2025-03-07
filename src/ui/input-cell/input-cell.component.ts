import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-cell',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <input type="text" [(ngModel)]="value" class="w-full px-2 py-1 border-0 focus:outline-none focus:border-blue-500" />
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    input {
      box-sizing: border-box;
      width: 100%;
      background: transparent;
      border: none;
    }
  `]
})
export class InputCellComponent {
  @Input() value: any;
}