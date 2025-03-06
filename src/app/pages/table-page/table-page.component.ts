import { Component } from '@angular/core';
import { HeaderComponent } from "../../layout/header/header.component";
import { TableComponent } from "../../table/table.component";
import { FooterComponent } from "../../layout/footer/footer.component";

@Component({
  selector: 'app-table-page',
  standalone: true,
  imports: [HeaderComponent, TableComponent, FooterComponent],
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.css'
})
export class TablePageComponent {
  // @Input() columnDataMapper: string[];
}
