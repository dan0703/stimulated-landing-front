import { Injectable, signal, computed, Inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { SamplePack, CartItem, Cart, ApiResponse } from '../interfaces/e-commerce.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signals para estado reactivo
  private _cartItems = signal<CartItem[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Computed signals para valores derivados
  public cartItems = this._cartItems.asReadonly();
  public isLoading = this._isLoading.asReadonly();
  public error = this._error.asReadonly();

  // Computed para estadísticas del carrito
  public totalItems = computed(() =>
    this._cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  public subtotal = computed(() =>
    this._cartItems().reduce((total, item) => total + (item.samplePack.price * item.quantity), 0)
  );

  public tax = computed(() => this.subtotal() * 0.1); // 10% tax

  public totalPrice = computed(() => this.subtotal() + this.tax());

  public cart = computed<Cart>(() => ({
    items: this._cartItems(),
    totalItems: this.totalItems(),
    totalPrice: this.totalPrice(),
    subtotal: this.subtotal(),
    tax: this.tax()
  }));

  // BehaviorSubject para compatibilidad con observables (futuras APIs)
  private _cartSubject = new BehaviorSubject<Cart>(this.cart());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Solo cargar carrito desde localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadCartFromStorage();
    }

    // Sincronizar con BehaviorSubject cuando cambie el cart signal
    // Usando effect de Angular para reactividad automática
    effect(() => {
      // Solo ejecutar en el navegador
      if (isPlatformBrowser(this.platformId)) {
        this._cartSubject.next(this.cart());
      }
    });
  }

  /**
   * Obtener carrito como Observable para futuras integraciones
   */
  getCart(): Observable<Cart> {
    // En el servidor, devolver el estado actual sin sincronización
    if (!isPlatformBrowser(this.platformId)) {
      return new BehaviorSubject<Cart>(this.cart()).asObservable();
    }
    return this._cartSubject.asObservable();
  }

  /**
   * Agregar item al carrito
   */
  addToCart(samplePack: SamplePack, quantity: number = 1): void {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      const currentItems = this._cartItems();
      const existingItemIndex = currentItems.findIndex(item => item.samplePack.id === samplePack.id);

      if (existingItemIndex !== -1) {
        // Si el item ya existe, incrementar cantidad
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        this._cartItems.set(updatedItems);
      } else {
        // Si es nuevo, agregarlo
        const newItem: CartItem = {
          id: this.generateCartItemId(),
          samplePack,
          quantity,
          addedAt: new Date()
        };
        this._cartItems.set([...currentItems, newItem]);
      }

      this.saveCartToStorage();
      this._isLoading.set(false);
    } catch (error) {
      this._error.set('Error adding item to cart');
      this._isLoading.set(false);
      console.error('Error adding to cart:', error);
    }
  }

  /**
   * Remover item del carrito
   */
  removeFromCart(itemId: string): void {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      const updatedItems = this._cartItems().filter(item => item.id !== itemId);
      this._cartItems.set(updatedItems);
      this.saveCartToStorage();
      this._isLoading.set(false);
    } catch (error) {
      this._error.set('Error removing item from cart');
      this._isLoading.set(false);
      console.error('Error removing from cart:', error);
    }
  }

  /**
   * Actualizar cantidad de un item
   */
  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    try {
      this._isLoading.set(true);
      this._error.set(null);

      const currentItems = this._cartItems();
      const itemIndex = currentItems.findIndex(item => item.id === itemId);

      if (itemIndex !== -1) {
        const updatedItems = [...currentItems];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity
        };
        this._cartItems.set(updatedItems);
        this.saveCartToStorage();
      }

      this._isLoading.set(false);
    } catch (error) {
      this._error.set('Error updating quantity');
      this._isLoading.set(false);
      console.error('Error updating quantity:', error);
    }
  }

  /**
   * Limpiar carrito
   */
  clearCart(): void {
    this._cartItems.set([]);
    this.saveCartToStorage();
  }

  /**
   * Verificar si un sample pack está en el carrito
   */
  isInCart(samplePackId: string): boolean {
    return this._cartItems().some(item => item.samplePack.id === samplePackId);
  }

  /**
   * Obtener cantidad de un sample pack en el carrito
   */
  getItemQuantity(samplePackId: string): number {
    const item = this._cartItems().find(item => item.samplePack.id === samplePackId);
    return item ? item.quantity : 0;
  }

  /**
   * Procesar compra (preparado para API futura)
   */
  async processCheckout(userEmail: string): Promise<ApiResponse<any>> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      // Simular llamada a API
      await this.simulateApiCall();

      // TODO: Integrar con API real
      // const response = await this.http.post('/api/checkout', {
      //   items: this._cartItems(),
      //   userEmail,
      //   total: this.totalPrice()
      // }).toPromise();

      const response: ApiResponse<any> = {
        success: true,
        message: 'Purchase completed successfully',
        data: {
          orderId: this.generateOrderId(),
          downloadLinks: this._cartItems().map(item => ({
            samplePackId: item.samplePack.id,
            url: `https://api.stimulated.com/download/${item.samplePack.id}`,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
          }))
        }
      };

      if (response.success) {
        this.clearCart();
      }

      this._isLoading.set(false);
      return response;
    } catch (error) {
      this._error.set('Error processing checkout');
      this._isLoading.set(false);
      return {
        success: false,
        error: 'Checkout failed'
      };
    }
  }

  /**
   * Guardar carrito en localStorage
   */
  private saveCartToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // No guardar en servidor
    }

    try {
      const cartData = {
        items: this._cartItems(),
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('stimulated_cart', JSON.stringify(cartData));
    } catch (error) {
      console.warn('Could not save cart to localStorage:', error);
    }
  }

  /**
   * Cargar carrito desde localStorage
   */
  private loadCartFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // No cargar en servidor
    }

    try {
      const savedCart = localStorage.getItem('stimulated_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        // Verificar que no sea muy antiguo (7 días)
        const savedAt = new Date(cartData.savedAt);
        const now = new Date();
        const daysDiff = (now.getTime() - savedAt.getTime()) / (1000 * 3600 * 24);

        if (daysDiff < 7 && cartData.items) {
          this._cartItems.set(cartData.items);
        }
      }
    } catch (error) {
      console.warn('Could not load cart from localStorage:', error);
    }
  }

  /**
   * Generar ID único para items del carrito
   */
  private generateCartItemId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generar ID de orden
   */
  private generateOrderId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Simular llamada a API
   */
  private simulateApiCall(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }
}
