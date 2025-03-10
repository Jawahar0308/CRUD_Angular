// src/app/table/table.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHeaderComponent } from "./table-header/table-header.component";
import { TableBodyComponent } from "./table-row/table-row.component";
import { ApiService } from "../services/api.service";
import { ButtonComponent } from '../../ui/button/button.component';
import { ModalComponent } from '../../ui/modal/modal.component';
import { FilterComponent } from '../../ui/filter/filter.component';
import { SortComponent } from '../../ui/sorting/sorting.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    TableHeaderComponent,
    TableBodyComponent,
    ButtonComponent,
    ModalComponent,
    FilterComponent,
    SortComponent
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() columns: string[] = [];
  @Input() columnDataMapper: string[] = [];
  @Input() data: any[] = [];

  // Original data without any filtering/sorting
  originalData: any[] = [];

  // Data displayed in the table
  displayedData: any[] = [];

  // Editing state
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

  // Selection state
  selectedRows: Set<number> = new Set();
  isAllSelected: boolean = false;
  showDeleteModal: boolean = false;
  isLoading = true;

  // Filtering state
  globalFilter: string = '';
  columnFilters: { [columnIndex: number]: string } = {};

  // Sorting state
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    if (!this.data || this.data.length === 0) {
      this.isLoading = true;
      this.apiService.getDataFromMultipleAPIs().subscribe(
        (mergedData) => {
          this.originalData = mergedData;
          this.displayedData = [...this.originalData];
          this.editedData = JSON.parse(JSON.stringify(this.displayedData));
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching data:', error);
          this.isLoading = false;
        }
      );
    } else {
      this.originalData = [...this.data];
      this.displayedData = [...this.originalData];
      this.editedData = JSON.parse(JSON.stringify(this.displayedData));
      this.isLoading = false;
    }
  }

  // EDIT METHODS
  onEdit() {
    if (!this.isEditing) {
      this.isEditing = true;
      this.changedCells = [];
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

    // Update the original data with edited changes
    this.displayedData = JSON.parse(JSON.stringify(this.editedData));

    // Apply any filters again to maintain consistency
    this.applyFiltersAndSort();

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

  // SELECTION METHODS
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
      for (let i = 0; i < this.displayedData.length; i++) {
        this.selectedRows.add(i);
      }
    } else {
      // Deselect all rows
      this.selectedRows.clear();
    }
  }

  // FILTER METHODS
  onGlobalFilterChange(value: string) {
    this.globalFilter = value;
    this.applyFiltersAndSort();
  }

  onColumnFilterChange(event: { columnIndex: number, value: string }) {
    if (event.value) {
      this.columnFilters[event.columnIndex] = event.value;
    } else {
      delete this.columnFilters[event.columnIndex];
    }
    this.applyFiltersAndSort();
  }

  // SORT METHODS
  onSortChange(event: { column: string, direction: 'asc' | 'desc' }) {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.applyFiltersAndSort();
  }

  // FILTER AND SORT IMPLEMENTATION
  applyFiltersAndSort() {
    // Start with a copy of original data
    let filteredData = JSON.parse(JSON.stringify(this.originalData));

    // Apply global filter
    if (this.globalFilter) {
      const searchTerm = this.globalFilter.toLowerCase();
      filteredData = filteredData.filter((row: any) => {
        // Search through all mapped columns
        return this.columnDataMapper.some(path => {
          if (!path) return false;
          const value = this.getNestedValue(row, path);
          return value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchTerm);
        });
      });
    }

    // Apply column filters
    Object.entries(this.columnFilters).forEach(([columnIndexStr, filterValue]) => {
      const columnIndex = parseInt(columnIndexStr);
      const path = this.columnDataMapper[columnIndex - 1]; // Adjust for first checkbox column

      if (path && filterValue) {
        const searchTerm = filterValue.toLowerCase();
        filteredData = filteredData.filter((row: any) => {
          const value = this.getNestedValue(row, path);
          return value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchTerm);
        });
      }
    });

    // Apply sort
    if (this.sortColumn) {
      const colIndex = this.columns.indexOf(this.sortColumn) - 1; // Adjust for first checkbox column
      if (colIndex >= 0) {
        const path = this.columnDataMapper[colIndex];

        filteredData.sort((a: any, b: any) => {
          const valueA = this.getNestedValue(a, path);
          const valueB = this.getNestedValue(b, path);

          // Handle null values
          if (valueA === null && valueB === null) return 0;
          if (valueA === null) return this.sortDirection === 'asc' ? 1 : -1;
          if (valueB === null) return this.sortDirection === 'asc' ? -1 : 1;

          // Compare values
          if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
          if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }

    // Update displayed data
    this.displayedData = filteredData;
    this.editedData = JSON.parse(JSON.stringify(this.displayedData));
  }

  // Helper method to access nested properties
  getNestedValue(obj: any, path: string): any {
    if (!path) return '';

    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : null;
    }, obj);
  }

  // MODAL AND DELETE OPERATIONS
  get hasSelectedRows(): boolean {
    return this.selectedRows.size > 0;
  }

  get hasData(): boolean {
    return this.displayedData && this.displayedData.length > 0;
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

    // Remove the selected rows from the data arrays
    selectedIndices.forEach(index => {
      // Get the ID of the row to remove from original data
      const idToRemove = this.displayedData[index].id;

      // Remove from displayed data
      this.displayedData.splice(index, 1);
      this.editedData.splice(index, 1);

      // Remove from original data
      const originalIndex = this.originalData.findIndex(item => item.id === idToRemove);
      if (originalIndex >= 0) {
        this.originalData.splice(originalIndex, 1);
      }
    });

    // Clear selection after deletion
    this.selectedRows.clear();
    this.isAllSelected = false;
    this.showDeleteModal = false;

    console.log('Deleted rows at indices:', selectedIndices);
  }
}