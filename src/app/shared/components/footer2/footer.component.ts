import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  // Aquí puedes agregar propiedades y métodos del footer
  currentYear = new Date().getFullYear();

  // Ejemplo de datos que podrías tener
  socialLinks = [
    { name: 'Twitter', url: '#', icon: 'twitter' },
    { name: 'LinkedIn', url: '#', icon: 'linkedin' },
    { name: 'Instagram', url: '#', icon: 'instagram' }
  ];

  navigationLinks = [
    { name: 'About', url: '/about' },
    { name: 'Services', url: '/services' },
    { name: 'Contact', url: '/contact' }
  ];
}
