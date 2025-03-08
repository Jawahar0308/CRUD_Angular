import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">{{ title }}</h3>
        <p class="mb-6">{{ message }}</p>
        <div class="flex justify-end space-x-2">
          <button 
            class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            (click)="onCancel()">
            Cancel
          </button>
          <button 
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            (click)="onConfirm()">
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ModalComponent {
  @Input() title: string = 'Confirm';
  @Input() message: string = 'Are you sure?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}