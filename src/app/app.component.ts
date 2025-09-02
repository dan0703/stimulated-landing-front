import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkInProgressPageComponent } from './features/work-in-progress-page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, WorkInProgressPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stimulated-landing-front';
}
