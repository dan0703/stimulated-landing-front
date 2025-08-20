import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://api.example.com'; // Cambia esto por tu endpoint real

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, options: any = {}): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.get<T>(url, { ...options }).pipe(
      map(response => response as T)
    );
  }

  post<T>(endpoint: string, body: any, options: any = {}): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.post<T>(url, body, { ...options }).pipe(
      map(response => response as T)
    );
  }

  // Puedes agregar put, delete, patch, etc.
}
