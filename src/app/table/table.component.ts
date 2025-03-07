import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHeaderComponent } from "./table-header/table-header.component";
import { TableBodyComponent } from "./table-row/table-row.component";
import { ApiService } from "../services/api.service";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableHeaderComponent, TableBodyComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() columns: string[] = [];
  @Input() columnDataMapper: string[] = [];
  @Input() data: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    if (!this.data || this.data.length === 0) {
      this.apiService.getDataFromMultipleAPIs().subscribe(
        (mergedData) => {
          this.data = mergedData;
        },
        (error) => console.error('Error fetching data:', error)
      );
    }
  }
}