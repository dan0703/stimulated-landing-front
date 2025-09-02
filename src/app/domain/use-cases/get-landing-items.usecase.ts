import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LandingItem } from '../entities/landing-item';
import { LandingRepositoryImpl } from '../../data/repositories/landing-repository-impl';

@Injectable({ providedIn: 'root' })
export class GetLandingItemsUseCase {
  constructor(private repository: LandingRepositoryImpl) {}

  execute(): Observable<LandingItem[]> {
    return this.repository.getItems();
  }
}
