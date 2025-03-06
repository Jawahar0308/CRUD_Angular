import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser, IAlbum } from '../../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private usersUrl = 'https://jsonplaceholder.typicode.com/users';
  private albumsUrl = 'https://jsonplaceholder.typicode.com/albums';

  public users$ = new BehaviorSubject<IUser[]>([]);
  public albums$ = new BehaviorSubject<IAlbum[]>([]);

  constructor(private http: HttpClient) { }

  forkJoin({
    users: this.http.get<any[]> (this.apiUrl1),
      comments: this.http.get<any[]>(this.apiUrl2)
  }).subscribe(({ users, comments }) => {
        // Store the raw data directly in a variable
        this.tableData = { users, comments };
      });


  // Handle API errors
  private handleError(error: HttpErrorResponse) {
  console.error('API Error:', error);
  return throwError(() => new Error('Something went wrong! Please try again.'));
}

  // CRUD operations for users
  // createUser(user: any) {
  //   return this.http.post<any>(this.usersUrl, user).pipe(
  //     tap(() => {
  //       this.getUsers();
  //     })
  //   );
  // }

  // updateUser(id: string, user: any) {
  //   return this.http
  //     .put<any>(`${this.usersUrl}/${id}`, user)
  //     .subscribe(() => {
  //       this.getUsers();
  //     });
  // }

  // deleteUser(id: string) {
  //   return this.http.delete(`${this.usersUrl}/${id}`).subscribe(() => {
  //     this.getUsers();
  //   });
  // }

  // private getUsers() {
  //   this.http.get<IUser[]>(this.usersUrl).subscribe(users => {
  //     this.users$.next(users);
  //   });
  // }

  // // CRUD operations for albums
  // createAlbum(album: any) {
  //   return this.http.post<any>(this.albumsUrl, album).pipe(
  //     tap(() => {
  //       this.getAlbums();
  //     })
  //   );
  // }

  // updateAlbum(id: string, album: any) {
  //   return this.http
  //     .put<any>(`${this.albumsUrl}/${id}`, album)
  //     .subscribe(() => {
  //       this.getAlbums();
  //     });
  // }

  // deleteAlbum(id: string) {
  //   return this.http.delete(`${this.albumsUrl}/${id}`).subscribe(() => {
  //     this.getAlbums();
  //   });
  // }

  // private getAlbums() {
  //   this.http.get<IAlbum[]>(this.albumsUrl).subscribe(albums => {
  //     this.albums$.next(albums);
  //   });
  // }
}