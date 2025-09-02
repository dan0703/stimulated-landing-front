import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LandingItem } from '../../domain/entities/landing-item';
import { LandingRepository } from '../../domain/repositories/landing-repository';
import { LandingApiDataSource } from '../datasources/landing-api.datasource';

@Injectable({ providedIn: 'root' })
export class LandingRepositoryImpl implements LandingRepository {
  constructor(private dataSource: LandingApiDataSource) {}

  getItems(): Observable<LandingItem[]> {
    return this.dataSource.getItems();
  }
}
