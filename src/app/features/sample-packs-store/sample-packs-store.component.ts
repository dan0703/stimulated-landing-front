import { Component, Input, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../shared/services/cart.service';
import { SamplePacksApiService } from '../../shared/services/sample-packs-api.service';
import { CartComponent } from '../../shared/components/cart/cart.component';
import { CartIconComponent } from '../../shared/components/cart-icon/cart-icon.component';
import { SamplePack, PaginatedResponse } from '../../shared/interfaces/e-commerce.interface';

@Component({
  selector: 'app-sample-packs-store',
  standalone: true,
  imports: [CommonModule, CartComponent, CartIconComponent],
  templateUrl: './sample-packs-store.component.html',
  styleUrls: ['./sample-packs-store.component.css']
})
export class SamplePacksStoreComponent implements OnInit {
  @Input() title = 'STIMULATED AUDIO';
  @Input() subtitle = 'Premium Sample Packs & Loops';

  // Services
  cartService = inject(CartService);
  samplePacksApi = inject(SamplePacksApiService);

  // Expose Math to template
  Math = Math;

  // Estado del componente
  currentlyPlaying = signal<string | null>(null);
  selectedGenre = signal<string>('All');
  isCartOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  // Paginación API-ready
  currentPage = signal<number>(1);
  pageSize = signal<number>(12);
  pageSizeOptions = [12, 25, 50];

  // Data from API
  samplePacks = signal<SamplePack[]>([]);
  featuredPacks = signal<SamplePack[]>([]);
  pagination = signal<PaginatedResponse<SamplePack>['pagination'] | null>(null);

  // Computed properties
  genres = ['All', 'Techno', 'House', 'Ambient', 'Bass'];

  // Effects para API calls
  constructor() {
    // Efecto para cargar datos cuando cambian los parámetros de paginación
    effect(() => {
      // Dependencias: currentPage, pageSize, selectedGenre
      const page = this.currentPage();
      const pageSize = this.pageSize();
      const genre = this.selectedGenre();

      this.loadSamplePacks();
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    // Carga inicial
    this.loadFeaturedPacks();
  }

  // API Methods
  private loadSamplePacks(): void {
    this.isLoading.set(true);

    this.samplePacksApi.getSamplePacks({
      page: this.currentPage(),
      pageSize: this.pageSize(),
      genre: this.selectedGenre()
    }).subscribe({
      next: (response) => {
        this.samplePacks.set(response.data);
        this.pagination.set(response.pagination);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading sample packs:', error);
        this.isLoading.set(false);
      }
    });
  }

  private loadFeaturedPacks(): void {
    this.samplePacksApi.getFeaturedPacks().subscribe({
      next: (packs) => {
        this.featuredPacks.set(packs);
      },
      error: (error) => {
        console.error('Error loading featured packs:', error);
      }
    });
  }

  // Computed properties for pagination info
  totalPages = computed(() => {
    return this.pagination()?.totalPages || 0;
  });

  totalItems = computed(() => {
    return this.pagination()?.totalItems || 0;
  });

  hasNextPage = computed(() => {
    return this.pagination()?.hasNextPage || false;
  });

  hasPreviousPage = computed(() => {
    return this.pagination()?.hasPreviousPage || false;
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total === 0) return pages;

    // Mostrar máximo 5 números de página
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);

    // Ajustar si estamos al final
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  // Computed for pagination display info
  startIndex = computed(() => {
    const pagination = this.pagination();
    if (!pagination) return 0;
    return (pagination.currentPage - 1) * pagination.pageSize + 1;
  });

  endIndex = computed(() => {
    const pagination = this.pagination();
    if (!pagination) return 0;
    return Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems);
  });

  // Métodos
  selectGenre(genre: string): void {
    this.selectedGenre.set(genre);
    this.currentPage.set(1); // Reset a la primera página cuando cambia el filtro
  }

  // Métodos de paginación API-ready
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      // Scroll to top of products section
      document.querySelector('.products-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1); // Reset a la primera página cuando cambia page size
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.changePageSize(+select.value);
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.changePage(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.changePage(this.currentPage() + 1);
    }
  }

  toggleAudioPreview(packId: string): void {
    if (this.currentlyPlaying() === packId) {
      this.currentlyPlaying.set(null);
      // TODO: Stop audio
    } else {
      this.currentlyPlaying.set(packId);
      // TODO: Play audio preview
    }
  }

  addToCart(pack: SamplePack): void {
    this.cartService.addToCart(pack, 1);
  }

  buyNow(pack: SamplePack): void {
    this.cartService.addToCart(pack, 1);
    this.isCartOpen.set(true);
  }

  toggleCart(): void {
    this.isCartOpen.set(!this.isCartOpen());
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }

  onPurchaseCompleted(data: any): void {
    console.log('Purchase completed:', data);
    // TODO: Handle successful purchase (analytics, redirects, etc.)
  }
}
