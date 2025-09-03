import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-work-in-progress-page',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './work-in-progress-page.component.html',
  styleUrls: ['./work-in-progress-page.component.css']
})
export class WorkInProgressPageComponent {

}
