import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  // Get data from multiple APIs and merge
  getDataFromMultipleAPIs(): Observable<any[]> {
    return forkJoin({
      users: this.http.get<IUser[]>(this.usersUrl),
      albums: this.http.get<IAlbum[]>(this.albumsUrl)
    }).pipe(
      map(({ users, albums }) => {
        // Merge data from both APIs
        return users.map(user => {
          const userAlbums = albums.filter(album => album['userId'] === user['id']);
          return {
            ...user,
            albums: userAlbums,
            title: userAlbums.length > 0 ? userAlbums[0]['title'] : 'No album found'
          };
        });
      }),
      catchError(this.handleError)
    );
  }

  // Handle API errors
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong! Please try again.'));
  }
}