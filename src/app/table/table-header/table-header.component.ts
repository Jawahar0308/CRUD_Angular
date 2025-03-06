import { Component, Input } from '@angular/core';
import { CheckboxComponent } from "../../../ui/checkbox/checkbox.component";

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CheckboxComponent],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.css'
})
export class TableHeaderComponent {
  @Input() columns: string[] = [];
}
