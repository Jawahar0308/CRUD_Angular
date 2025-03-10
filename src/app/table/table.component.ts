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
    isValid?: boolean;
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

  onCellEdit(change: { rowIndex: number, columnIndex: number, path: string, oldValue: any, newValue: any, isValid: boolean }) {
    const rowId = this.editedData[change.rowIndex]?.id || `row-${change.rowIndex}`;

    // Store the validation state and raw value for processing during save
    const existingChangeIndex = this.changedCells.findIndex(
      c => c.rowIndex === change.rowIndex && c.columnIndex === change.columnIndex
    );

    if (existingChangeIndex >= 0) {
      this.changedCells[existingChangeIndex].newValue = change.newValue;
      this.changedCells[existingChangeIndex].isValid = change.isValid;
    } else {
      this.changedCells.push({
        ...change,
        rowId,
        isValid: change.isValid
      });
    }
  }

  onSave() {
    // Deep clone to avoid modifying the editing values
    const processedData = JSON.parse(JSON.stringify(this.editedData));

    // Create a map of changed cells for quick lookup
    const changedCellsMap = new Map();
    this.changedCells.forEach(change => {
      const key = `${change.rowIndex}-${change.path}`;
      changedCellsMap.set(key, change);
    });

    // Process each cell to format null and invalid values, but only validate changed cells
    processedData.forEach((row: any, rowIndex: any) => {
      this.columnDataMapper.forEach((path, colIndex) => {
        if (path) {
          const parts = path.split('.');
          let current = row;

          // Get the value to validate
          const value = this.getNestedValue(row, path);

          // Check if this cell was edited
          const wasEdited = changedCellsMap.has(`${rowIndex}-${path}`);

          // Handle empty/null values - explicitly set them to null
          if (value === null || value === undefined || value === '') {
            // Navigate to the parent object
            for (let i = 0; i < parts.length - 1; i++) {
              if (current && current[parts[i]]) {
                current = current[parts[i]];
              } else {
                break;
              }
            }

            // Set empty values to null
            const lastPart = parts[parts.length - 1];
            if (current) {
              current[lastPart] = null;
            }
            return; // Skip further processing
          }

          // Only validate cells that were actually edited
          if (wasEdited) {
            let isValid = true;
            if (path.includes('email')) {
              isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            } else if (path.includes('phone')) {
              isValid = /^\+?[1-9]\d{0,2}[\s\-\(\)\.]*[0-9][0-9\s\-\(\)\.]*$/.test(value);
            } else if (path === 'id' || path.includes('userId')) {
              isValid = !isNaN(Number(value));
            } else {
              isValid = value !== '';
            }

            // Navigate to the parent object
            for (let i = 0; i < parts.length - 1; i++) {
              if (current && current[parts[i]]) {
                current = current[parts[i]];
              } else {
                break;
              }
            }

            // Set invalid values to "unknown" only if the cell was edited
            const lastPart = parts[parts.length - 1];
            if (current && !isValid) {
              current[lastPart] = "unknown";
            }
          }
        }
      });
    });

    // Now update the display data with the processed values
    this.displayedData = processedData;

    // Also update the original data if needed
    this.originalData = this.originalData.map(row => {
      const matchedRow = processedData.find((pRow: { id: any; }) => pRow.id === row.id);
      return matchedRow || row;
    });

    // Update the editing data to reflect the changes
    this.editedData = JSON.parse(JSON.stringify(this.displayedData));

    if (this.changedCells.length > 0) {
      console.log('Edited Cell Data:', this.changedCells);

      const formattedChanges = this.changedCells.map(change => {
        const columnName = this.columns[change.columnIndex + 1];
        return {
          row: change.rowId,
          field: columnName,
          path: change.path,
          from: change.oldValue,
          to: change.newValue,
          isValid: change.isValid
        };
      });

      console.log('Formatted Changes:', formattedChanges);
    } else {
      console.log('No cells were edited');
    }

    this.isEditing = false;

    // Clear the changed cells array after saving
    this.changedCells = [];
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