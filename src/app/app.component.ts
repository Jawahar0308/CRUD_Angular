import { Component, OnInit } from '@angular/core';
import { TablePageComponent } from "./pages/table-page/table-page.component";
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TablePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'CRUD_Angular';
  users: any[] = [];
  columns = ['', 'Name', 'Company Name', 'Email', 'Street', 'City', 'Phone', 'Website', 'Title'];
  columnDataMapper = ['name', 'company.name', 'email', 'address.street', 'address.city', 'phone', 'website', 'title'];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getDataFromMultipleAPIs().subscribe(
      data => {
        this.users = data;
      },
      error => console.error('Error fetching data:', error)
    );
  }
}