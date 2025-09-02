import { Observable } from 'rxjs';
import { LandingItem } from '../entities/landing-item';

export interface LandingRepository {
  getItems(): Observable<LandingItem[]>;
}
