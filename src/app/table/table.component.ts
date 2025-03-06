// filepath: /home/jawahar/FRONTEND/Angular/CRUD_Angular/src/app/table/table.component.ts
import { Component } from '@angular/core';
import { TableHeaderComponent } from "./table-header/table-header.component";
import { TableRowComponent } from "./table-row/table-row.component";

@Component({
  selector: 'app-table',
  imports: [TableHeaderComponent, TableRowComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: true
})
export class TableComponent implements OnInit {
  column: string[] = ['Name', 'Company Name', 'Email', 'Street', 'City', 'Phone', 'Website', 'Title'];
  data: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getDataFromMultipleAPIs().subscribe(
      (mergedData) => {
        this.data = mergedData;
      },
      (error) => console.error('Error fetching data:', error)
    );
  }
}