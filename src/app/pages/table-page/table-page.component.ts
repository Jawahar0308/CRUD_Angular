import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../layout/header/header.component";
import { TableComponent } from "../../table/table.component";
import { FooterComponent } from "../../layout/footer/footer.component";

@Component({
  selector: 'app-table-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TableComponent, FooterComponent],
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.css'
})
export class TablePageComponent {
  columns = ['', 'Name', 'Company Name', 'Email', 'Street', 'City', 'Phone', 'Website', 'Title'];
  columnDataMapper = ['name', 'company.name', 'email', 'address.street', 'address.city', 'phone', 'website', 'title'];
}