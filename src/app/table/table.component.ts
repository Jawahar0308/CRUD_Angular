// src/app/table/table.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHeaderComponent } from "./table-header/table-header.component";
import { TableBodyComponent } from "./table-row/table-row.component";
import { ApiService } from "../services/api.service";
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableHeaderComponent, TableBodyComponent, ButtonComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() columns: string[] = [];
  @Input() columnDataMapper: string[] = [];
  @Input() data: any[] = [];

  isEditing = false;
  editedData: any[] = [];
  changedCells: {
    rowIndex: number;
    columnIndex: number;
    path: string;
    oldValue: any;
    newValue: any;
    rowId?: any; // To help identify the row in the console
  }[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    if (!this.data || this.data.length === 0) {
      this.apiService.getDataFromMultipleAPIs().subscribe(
        (mergedData) => {
          this.data = mergedData;
          this.editedData = JSON.parse(JSON.stringify(this.data)); // Deep copy
        },
        (error) => console.error('Error fetching data:', error)
      );
    } else {
      this.editedData = JSON.parse(JSON.stringify(this.data)); // Deep copy
    }
  }

  onEdit() {
    if (!this.isEditing) {
      this.isEditing = true;
      // Reset tracked changes when starting a new edit session
      this.changedCells = [];
    }
  }

  onCellEdit(change: { rowIndex: number, columnIndex: number, path: string, oldValue: any, newValue: any }) {
    // Add row identifier (using id or another unique field if available)
    const rowId = this.editedData[change.rowIndex]?.id || `row-${change.rowIndex}`;

    // Check if this cell was already changed
    const existingChangeIndex = this.changedCells.findIndex(
      c => c.rowIndex === change.rowIndex && c.columnIndex === change.columnIndex
    );

    if (existingChangeIndex >= 0) {
      // Update existing change
      this.changedCells[existingChangeIndex].newValue = change.newValue;
    } else {
      // Add new change
      this.changedCells.push({
        ...change,
        rowId
      });
    }
  }

  onSave() {
    // Apply changes to the original data
    this.data = JSON.parse(JSON.stringify(this.editedData));

    // Log only the changes to console
    if (this.changedCells.length > 0) {
      console.log('Edited Cell Data:', this.changedCells);

      // You can also format it in a more readable way if needed
      const formattedChanges = this.changedCells.map(change => {
        const columnName = this.columns[change.columnIndex + 1]; // +1 because first column is checkbox
        return {
          row: change.rowId,
          field: columnName,
          path: change.path,
          from: change.oldValue,
          to: change.newValue
        };
      });

      console.log('Formatted Changes:', formattedChanges);
    } else {
      console.log('No cells were edited');
    }

    this.isEditing = false;
  }
}