import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { LandingItem } from '../../domain/entities/landing-item';

@Injectable({ providedIn: 'root' })
export class LandingApiDataSource {
  constructor(private api: ApiService) {}

  getItems(): Observable<LandingItem[]> {
    return this.api.get<LandingItem[]>('test-endpoint');
  }
}
