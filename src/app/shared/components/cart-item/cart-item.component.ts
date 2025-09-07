import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/e-commerce.interface';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-item" [class.loading]="cartService.isLoading()">
      <div class="item-image">
        <img [src]="item.samplePack.imageUrl" [alt]="item.samplePack.title">
      </div>

      <div class="item-details">
        <h4 class="item-title">{{ item.samplePack.title }}</h4>
        <p class="item-artist">by {{ item.samplePack.artist }}</p>
        <div class="item-meta">
          <span class="genre">{{ item.samplePack.genre }}</span>
          <span class="bpm">{{ item.samplePack.bpm }} BPM</span>
        </div>
      </div>

      <div class="item-controls">
        <div class="quantity-controls">
          <button
            class="qty-btn"
            (click)="decreaseQuantity()"
            [disabled]="cartService.isLoading()">
            -
          </button>
          <span class="quantity">{{ item.quantity }}</span>
          <button
            class="qty-btn"
            (click)="increaseQuantity()"
            [disabled]="cartService.isLoading()">
            +
          </button>
        </div>

        <div class="item-price">
          <span class="total-price">\${{ (item.samplePack.price * item.quantity).toFixed(2) }}</span>
          <span class="unit-price">\${{ item.samplePack.price }} each</span>
        </div>

        <button
          class="remove-btn"
          (click)="removeItem()"
          [disabled]="cartService.isLoading()"
          title="Remove from cart">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .cart-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: rgba(0, 50, 100, 0.2);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }

    .cart-item:hover {
      border-color: rgba(0, 212, 255, 0.3);
    }

    .cart-item.loading {
      opacity: 0.7;
      pointer-events: none;
    }

    .item-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details {
      flex: 1;
      min-width: 0;
    }

    .item-title {
      font-family: 'Satoshi-Variable', sans-serif;
      font-variation-settings: 'wght' 600;
      font-size: 0.9rem;
      color: white;
      margin: 0 0 0.3rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-artist {
      font-size: 0.8rem;
      color: rgba(0, 212, 255, 0.8);
      margin: 0 0 0.5rem 0;
    }

    .item-meta {
      display: flex;
      gap: 0.5rem;
      font-size: 0.7rem;
    }

    .genre {
      color: rgba(0, 212, 255, 0.8);
    }

    .bpm {
      color: rgba(255, 255, 255, 0.6);
    }

    .item-controls {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 0.2rem;
    }

    .qty-btn {
      background: transparent;
      border: none;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .qty-btn:hover:not(:disabled) {
      background: rgba(0, 212, 255, 0.3);
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity {
      min-width: 20px;
      text-align: center;
      color: white;
      font-size: 0.8rem;
    }

    .item-price {
      text-align: right;
    }

    .total-price {
      font-family: 'Satoshi-Variable', sans-serif;
      font-variation-settings: 'wght' 600;
      color: white;
      font-size: 0.9rem;
      display: block;
    }

    .unit-price {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .remove-btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      padding: 0.3rem;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .remove-btn:hover:not(:disabled) {
      color: #ff4757;
      background: rgba(255, 71, 87, 0.1);
    }

    .remove-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .cart-item {
        flex-direction: column;
        gap: 0.8rem;
      }

      .item-controls {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
  `]
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() quantityChanged = new EventEmitter<{ itemId: string; quantity: number }>();
  @Output() itemRemoved = new EventEmitter<string>();

  cartService = inject(CartService);

  increaseQuantity(): void {
    const newQuantity = this.item.quantity + 1;
    this.cartService.updateQuantity(this.item.id, newQuantity);
    this.quantityChanged.emit({ itemId: this.item.id, quantity: newQuantity });
  }

  decreaseQuantity(): void {
    const newQuantity = this.item.quantity - 1;
    if (newQuantity > 0) {
      this.cartService.updateQuantity(this.item.id, newQuantity);
      this.quantityChanged.emit({ itemId: this.item.id, quantity: newQuantity });
    }
  }

  removeItem(): void {
    this.cartService.removeFromCart(this.item.id);
    this.itemRemoved.emit(this.item.id);
  }
}
