import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Address } from '../../models/user.model';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    cartItems: CartItem[] = [];
    loading = true;
    error = '';

    // Checkout Details
    shippingAddress: Address = {
        city: '',
        state: '',
        country: '',
        pincode: ''
    };
    paymentMethod = 'credit_card';
    isCheckingOut = false;

    constructor(private cartService: CartService, private router: Router) { }

    ngOnInit(): void {
        this.loadCart();
    }

    loadCart() {
        this.cartService.getCart().subscribe({
            next: (items) => {
                this.cartItems = items;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load cart';
                this.loading = false;
                console.error(err);
            }
        });
    }

    get totalAmount(): number {
        return this.cartItems.reduce((sum, item) => sum + (item.total || (item.price * item.quantity)), 0);
    }

    proceedToCheckout() {
        this.isCheckingOut = true;
    }

    placeOrder() {
        if (!this.shippingAddress.city || !this.shippingAddress.state) {
            alert('Please fill in address details');
            return;
        }

        const orderData = {
            items: this.cartItems,
            total_price: this.totalAmount,
            payment_method: this.paymentMethod,
            shipping_address: this.shippingAddress,
            seller_address: this.shippingAddress // Simplified for demo
        };

        this.cartService.placeOrder(orderData).subscribe({
            next: () => {
                alert('Order placed successfully!');
                this.router.navigate(['/books']);
            },
            error: (err) => {
                alert('Failed to place order');
                console.error(err);
            }
        });
    }
}
