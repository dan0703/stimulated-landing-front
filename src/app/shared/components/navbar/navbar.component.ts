import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { VideoService } from '../../services/video.service';
// import { LoadingService } from '../../services/loading.service';
// import { BlogService } from '../../services/blog.service';
// import { BlogSummary } from '../../models/blog/blog-summary';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMenuOpen = false;
  currentLang = 'EN';
  videoId: String = '';
  isBlogListVisible: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor() {}

  async ngOnInit() {

    // this.router.events.subscribe(async () => {
    //   const urlSegments = this.router.url.split('/');
    //   const lang = urlSegments[1];
    //   if (lang === 'EN' || lang === 'ES') {
    //     this.currentLang = lang;
    //     this.loadVideoGallery(this.currentLang);
    //     await this.loadBlogs();
    //   }
    // });
  }

  extractNumbers(input: String): String {
    const match = input.match(/\d+/g);
    return match ? match.join('') : '';
  }
}
