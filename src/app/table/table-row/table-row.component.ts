// filepath: /home/jawahar/FRONTEND/Angular/CRUD_Angular/src/app/table/table-row/table-row.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { InputCellComponent } from "../../../ui/input-cell/input-cell.component";
import { CheckboxComponent } from "../../../ui/checkbox/checkbox.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-row',
  standalone: true,
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.css'],
  imports: [CommonModule, InputCellComponent, CheckboxComponent]
})
export class TableRowComponent {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];

  // users: any[] = [];
  // albums: any[] = [];
  // constructor(private apiService: ApiService) { }

  // ngOnInit(): void {
  //   this.apiService.fetchMultipleAPIs().subscribe(([users, albums]) => {
  //     this.users = users;
  //     this.albums = albums;
  //   });
  // }

  // getAlbumTitle(userId: number): string {
  //   const album = this.albums.find(album => album.userId === userId);
  //   return album ? album.title : '';
  // }
}