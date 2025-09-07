import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="cart-icon-btn"
      (click)="toggleCart()"
      [class.has-items]="cartService.totalItems() > 0">

      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="m1 1 4 4v11h14l2-10H6"></path>
      </svg>

      <span
        class="cart-badge"
        *ngIf="cartService.totalItems() > 0">
        {{ cartService.totalItems() }}
      </span>
    </button>
  `,
  styles: [`
    .cart-icon-btn {
      position: relative;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.6rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cart-icon-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(0, 212, 255, 0.5);
      color: rgba(0, 212, 255, 1);
    }

    .cart-icon-btn.has-items {
      border-color: rgba(0, 212, 255, 0.6);
      color: rgba(0, 212, 255, 0.9);
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: linear-gradient(135deg, #ff6b35, #ff8c42);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bounce 0.5s ease;
    }

    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    @media (max-width: 768px) {
      .cart-icon-btn {
        padding: 0.5rem;
      }
    }
  `]
})
export class CartIconComponent {
  @Output() cartToggled = new EventEmitter<void>();

  cartService = inject(CartService);

  toggleCart(): void {
    this.cartToggled.emit();
  }
}
