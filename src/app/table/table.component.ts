import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHeaderComponent } from "./table-header/table-header.component";
import { TableBodyComponent } from "./table-row/table-row.component";
import { ApiService } from "../services/api.service";
import { ButtonComponent } from '../../ui/button/button.component';
import { ModalComponent } from '../../ui/modal/modal.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableHeaderComponent, TableBodyComponent, ButtonComponent, ModalComponent],
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
    rowId?: any;
  }[] = [];

  // New properties for deletion functionality
  selectedRows: Set<number> = new Set();
  isAllSelected: boolean = false;
  showDeleteModal: boolean = false;
  isLoading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    if (!this.data || this.data.length === 0) {
      this.isLoading = true;
      this.apiService.getDataFromMultipleAPIs().subscribe(
        (mergedData) => {
          this.data = mergedData;
          this.editedData = JSON.parse(JSON.stringify(this.data));
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching data:', error);
          this.isLoading = false;
        }
      );
    } else {
      this.editedData = JSON.parse(JSON.stringify(this.data));
      this.isLoading = false;
    }
  }

  onEdit() {
    // No need to check for isEditing state, just set it to true
    this.isEditing = true;
    // Make a copy of the data if not already done
    if (this.changedCells.length === 0) {
      this.editedData = JSON.parse(JSON.stringify(this.data));
    }
  }

  onCellEdit(change: { rowIndex: number, columnIndex: number, path: string, oldValue: any, newValue: any }) {
    const rowId = this.editedData[change.rowIndex]?.id || `row-${change.rowIndex}`;

    // Check if the value is empty and set it to null
    if (change.newValue === '') {
      change.newValue = null;
    }

    const existingChangeIndex = this.changedCells.findIndex(
      c => c.rowIndex === change.rowIndex && c.columnIndex === change.columnIndex
    );

    if (existingChangeIndex >= 0) {
      this.changedCells[existingChangeIndex].newValue = change.newValue;
    } else {
      this.changedCells.push({
        ...change,
        rowId
      });
    }

    // Enable the save button when there are changes
    this.isEditing = this.changedCells.length > 0;
  }

  onSave() {
    // Process the editedData to replace empty strings with null
    this.editedData.forEach(row => {
      this.columnDataMapper.forEach(path => {
        if (path) {
          const parts = path.split('.');
          let current = row;

          // Navigate to the nested property
          for (let i = 0; i < parts.length - 1; i++) {
            if (current && current[parts[i]]) {
              current = current[parts[i]];
            } else {
              break;
            }
          }

          // Set empty string values to null
          const lastPart = parts[parts.length - 1];
          if (current && current[lastPart] === '') {
            current[lastPart] = null;
          }
        }
      });
    });

    this.data = JSON.parse(JSON.stringify(this.editedData));

    if (this.changedCells.length > 0) {
      console.log('Edited Cell Data:', this.changedCells);

      const formattedChanges = this.changedCells.map(change => {
        const columnName = this.columns[change.columnIndex + 1];
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

  // New methods for checkbox selection
  onRowSelectionChange(event: { rowIndex: number, selected: boolean }) {
    if (event.selected) {
      this.selectedRows.add(event.rowIndex);
    } else {
      this.selectedRows.delete(event.rowIndex);
    }
  }

  onSelectAllChange(selected: boolean) {
    this.isAllSelected = selected;

    if (selected) {
      // Select all rows
      for (let i = 0; i < this.data.length; i++) {
        this.selectedRows.add(i);
      }
    } else {
      // Deselect all rows
      this.selectedRows.clear();
    }
  }

  get hasSelectedRows(): boolean {
    return this.selectedRows.size > 0;
  }

  get hasData(): boolean {
    return this.data && this.data.length > 0;
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  deleteSelectedRows() {
    // Convert set to array and sort in descending order to avoid index shifting problems
    const selectedIndices = Array.from(this.selectedRows).sort((a, b) => b - a);

    // Remove the selected rows from the data array
    selectedIndices.forEach(index => {
      this.data.splice(index, 1);
      this.editedData.splice(index, 1);
    });

    // Clear selection after deletion
    this.selectedRows.clear();
    this.isAllSelected = false;
    this.showDeleteModal = false;

    console.log('Deleted rows at indices:', selectedIndices);
  }
}