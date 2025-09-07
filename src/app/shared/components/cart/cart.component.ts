import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, CartItemComponent],
  template: `
    <div class="cart-container" [class.open]="isOpen">
      <!-- Cart Header -->
      <div class="cart-header">
        <h3 class="cart-title">
          Shopping Cart
          <span class="item-count" *ngIf="cartService.totalItems() > 0">
            ({{ cartService.totalItems() }})
          </span>
        </h3>
        <button class="close-btn" (click)="closeCart()" *ngIf="showCloseButton">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
          </svg>
        </button>
      </div>

      <!-- Cart Content -->
      <div class="cart-content">
        <!-- Empty Cart State -->
        <div class="empty-cart" *ngIf="cartService.totalItems() === 0">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="m1 1 4 4v11h14l2-10H6"></path>
            </svg>
          </div>
          <p class="empty-message">Your cart is empty</p>
          <p class="empty-submessage">Add some sample packs to get started!</p>
        </div>

        <!-- Cart Items -->
        <div class="cart-items" *ngIf="cartService.totalItems() > 0">
          <app-cart-item
            *ngFor="let item of cartService.cartItems(); trackBy: trackByItemId"
            [item]="item"
            (quantityChanged)="onQuantityChanged($event)"
            (itemRemoved)="onItemRemoved($event)">
          </app-cart-item>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary" *ngIf="cartService.totalItems() > 0">
          <div class="summary-row">
            <span class="label">Subtotal</span>
            <span class="value">\${{ cartService.subtotal().toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span class="label">Tax (10%)</span>
            <span class="value">\${{ cartService.tax().toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span class="label">Total</span>
            <span class="value">\${{ cartService.totalPrice().toFixed(2) }}</span>
          </div>
        </div>

        <!-- Checkout Section -->
        <div class="checkout-section" *ngIf="cartService.totalItems() > 0">
          <div class="email-input" *ngIf="!isCheckoutCompleted()">
            <label for="email">Email for download links:</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="userEmail"
              placeholder="your@email.com"
              [disabled]="cartService.isLoading()"
              class="email-field">
          </div>

          <div class="checkout-buttons" *ngIf="!isCheckoutCompleted()">
            <button
              class="btn-checkout"
              (click)="processCheckout()"
              [disabled]="!isEmailValid() || cartService.isLoading()">
              <span *ngIf="!cartService.isLoading()">
                Complete Purchase - \${{ cartService.totalPrice().toFixed(2) }}
              </span>
              <span *ngIf="cartService.isLoading()" class="loading">
                Processing...
              </span>
            </button>

            <button
              class="btn-clear"
              (click)="clearCart()"
              [disabled]="cartService.isLoading()">
              Clear Cart
            </button>
          </div>

          <!-- Success State -->
          <div class="checkout-success" *ngIf="isCheckoutCompleted()">
            <div class="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <h4>Purchase Successful!</h4>
            <p>Check your email for download links.</p>
            <button class="btn-new-purchase" (click)="startNewPurchase()">
              Continue Shopping
            </button>
          </div>

          <!-- Error State -->
          <div class="error-message" *ngIf="cartService.error()">
            <p>{{ cartService.error() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div class="cart-backdrop"
         *ngIf="isOpen && showBackdrop"
         (click)="closeCart()"></div>
  `,
  styles: [`
    .cart-container {
      background: rgba(10, 25, 50, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 15px;
      color: white;
      font-family: 'Satoshi-Variable', sans-serif;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 50, 100, 0.3);
    }

    .cart-title {
      font-variation-settings: 'wght' 600;
      font-size: 1.2rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .item-count {
      background: rgba(0, 212, 255, 0.8);
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 10px;
      font-size: 0.8rem;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .cart-content {
      overflow-y: auto;
      flex: 1;
      padding: 1rem 1.5rem;
    }

    .empty-cart {
      text-align: center;
      padding: 2rem 0;
    }

    .empty-icon {
      color: rgba(255, 255, 255, 0.3);
      margin-bottom: 1rem;
    }

    .empty-message {
      font-variation-settings: 'wght' 600;
      font-size: 1.1rem;
      margin: 0 0 0.5rem 0;
    }

    .empty-submessage {
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .cart-summary {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 1rem;
      margin-bottom: 1.5rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.3rem 0;
    }

    .summary-row.total {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 0.8rem;
      margin-top: 0.5rem;
      font-variation-settings: 'wght' 600;
      font-size: 1.1rem;
    }

    .checkout-section {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 1rem;
    }

    .email-input {
      margin-bottom: 1rem;
    }

    .email-input label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .email-field {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-family: inherit;
      box-sizing: border-box;
    }

    .email-field:focus {
      outline: none;
      border-color: rgba(0, 212, 255, 0.5);
    }

    .email-field::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .checkout-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .btn-checkout {
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 10px;
      font-family: 'Satoshi-Variable', sans-serif;
      font-variation-settings: 'wght' 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-checkout:hover:not(:disabled) {
      background: linear-gradient(135deg, #00b8e6, #0088bb);
      transform: translateY(-2px);
    }

    .btn-checkout:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-clear {
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.8rem;
      border-radius: 10px;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-clear:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .checkout-success {
      text-align: center;
      padding: 1rem 0;
    }

    .success-icon {
      color: #00ff88;
      margin-bottom: 1rem;
    }

    .checkout-success h4 {
      margin: 0 0 0.5rem 0;
      font-variation-settings: 'wght' 600;
    }

    .checkout-success p {
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 1rem 0;
    }

    .btn-new-purchase {
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 10px;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-new-purchase:hover {
      background: linear-gradient(135deg, #00b8e6, #0088bb);
    }

    .error-message {
      background: rgba(255, 71, 87, 0.2);
      border: 1px solid rgba(255, 71, 87, 0.5);
      border-radius: 8px;
      padding: 0.8rem;
      color: #ff4757;
      text-align: center;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .cart-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }

    /* Modal styles cuando isOpen es true */
    .cart-container.open {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      width: 90%;
      max-width: 500px;
    }

    @media (max-width: 768px) {
      .cart-container.open {
        width: 95%;
        max-height: 85vh;
      }

      .cart-header {
        padding: 1rem;
      }

      .cart-content {
        padding: 1rem;
      }
    }
  `]
})
export class CartComponent {
  @Input() isOpen = false;
  @Input() showCloseButton = true;
  @Input() showBackdrop = true;
  @Output() cartClosed = new EventEmitter<void>();
  @Output() purchaseCompleted = new EventEmitter<any>();

  cartService = inject(CartService);
  userEmail = '';
  isCheckoutCompleted = signal(false);

  closeCart(): void {
    this.cartClosed.emit();
  }

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.userEmail);
  }

  async processCheckout(): Promise<void> {
    if (!this.isEmailValid()) return;

    try {
      const response = await this.cartService.processCheckout(this.userEmail);

      if (response.success) {
        this.isCheckoutCompleted.set(true);
        this.purchaseCompleted.emit(response.data);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  startNewPurchase(): void {
    this.isCheckoutCompleted.set(false);
    this.userEmail = '';
    this.closeCart();
  }

  onQuantityChanged(event: { itemId: string; quantity: number }): void {
    // El CartItemComponent ya maneja la actualización del servicio
    // Este método puede ser usado para analytics o efectos adicionales
  }

  onItemRemoved(itemId: string): void {
    // El CartItemComponent ya maneja la eliminación del servicio
    // Este método puede ser usado para analytics o efectos adicionales
  }

  trackByItemId(index: number, item: any): string {
    return item.id;
  }
}
