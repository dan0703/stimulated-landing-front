import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // During development this points to the local mock server. Change to your real API for production.
  private baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, options: any = {}): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.get<T>(url, { ...options }).pipe(
      map(response => response as T),
      catchError(err => {
        console.error('ApiService GET error', err, url);
        return of(null as unknown as T);
      })
    );
  }

  post<T>(endpoint: string, body: any, options: any = {}): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.post<T>(url, body, { ...options }).pipe(
      map(response => response as T),
      catchError(err => {
        console.error('ApiService POST error', err, url);
        return of(null as unknown as T);
      })
    );
  }

  // Puedes agregar put, delete, patch, etc.
}
