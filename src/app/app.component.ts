import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TablePageComponent } from "./pages/table-page/table-page.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TablePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CRUD_Angular';
}
