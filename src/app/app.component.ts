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
export class AppComponent {
  title = 'CRUD_Angular';
}