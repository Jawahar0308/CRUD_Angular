// filepath: /home/jawahar/FRONTEND/Angular/CRUD_Angular/src/app/ui/input-cell/input-cell.component.ts
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-cell',
  templateUrl: './input-cell.component.html',
  styleUrls: ['./input-cell.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class InputCellComponent {
  @Input() value: any;
}