import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private usersUrl = 'https://jsonplaceholder.typicode.com/users';
  private albumsUrl = 'https://jsonplaceholder.typicode.com/posts';

  // public users$ = new BehaviorSubject<IUser[]>([]);
  // public albums$ = new BehaviorSubject<IAlbum[]>([]);

  constructor(private http: HttpClient) { }

  // Get data from multiple APIs and merge
  getDataFromMultipleAPIs(): Observable<any[]> {
    return forkJoin({
      // users: this.http.get<any[]>(this.usersUrl),
      albums: this.http.get<any[]>(this.albumsUrl)
    }).pipe(
      map(({ albums }) => {
        // Merge data from both APIs
        return albums.map(user => {
          const userAlbums = albums.filter(album => album['userId'] === user['id']);
          return {
            ...user
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