import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Address } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';

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
    savedAddresses: Address[] = [];
    selectedAddressIndex: number | string = 'new';

    shippingAddress: Address = {
        street: '',
        city: '',
        state: '',
        country: '',
        zip_code: ''
    };
    paymentMethod = 'credit_card';
    isCheckingOut = false;

    constructor(
        private cartService: CartService,
        private router: Router,
        private authService: AuthService,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.loadCart();
        this.loadAddresses();
        this.paymentMethod = 'COD';
    }

    loadAddresses() {
        this.userService.getAddresses().subscribe({
            next: (addrs) => {
                this.savedAddresses = addrs || [];
                if (this.savedAddresses.length > 0) {
                    this.selectedAddressIndex = 0;
                    this.shippingAddress = { ...this.savedAddresses[0] };
                }
            },
            error: (err) => console.error('Failed to load addresses', err)
        });
    }

    onAddressSelect() {
        if (this.selectedAddressIndex === 'new') {
            this.shippingAddress = { street: '', city: '', state: '', country: '', zip_code: '' };
        } else {
            const index = Number(this.selectedAddressIndex);
            if (this.savedAddresses[index]) {
                this.shippingAddress = { ...this.savedAddresses[index] };
            }
        }
    }

    saveNewAddress() {
        this.userService.addAddress(this.shippingAddress).subscribe({
            next: () => {
                Swal.fire('Success', 'Address saved successfully', 'success');
                this.loadAddresses();
            },
            error: (err) => Swal.fire('Error', 'Failed to save address', 'error')
        });
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
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load cart items.'
                });
            }
        });
    }

    get totalAmount(): number {
        return this.cartItems.reduce((sum, item) => sum + (item.total || (item.price * item.quantity)), 0);
    }

    incrementQuantity(item: CartItem) {
        item.quantity++;
        item.total = item.price * item.quantity;
        // Ideally call service to sync
    }

    decrementQuantity(item: CartItem) {
        if (item.quantity > 1) {
            item.quantity--;
            item.total = item.price * item.quantity;
        }
    }

    deleteItem(item: CartItem) {
        Swal.fire({
            title: 'Remove Item?',
            text: 'Are you sure you want to remove this book from your cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.cartService.removeFromCart(item.id).subscribe({
                    next: () => {
                        this.cartItems = this.cartItems.filter(i => i.id !== item.id);
                        Swal.fire('Removed!', 'Item has been removed.', 'success');
                    },
                    error: (err) => {
                        console.error(err);
                        Swal.fire('Error', 'Failed to remove item', 'error');
                    }
                });
            }
        });
    }

    proceedToCheckout() {
        this.isCheckingOut = true;
    }

    placeOrder() {
        if (!this.shippingAddress.city || !this.shippingAddress.state) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Address',
                text: 'Please fill in address details'
            });
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
                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed!',
                    text: 'Your order has been placed successfully.',
                    confirmButtonColor: '#6366f1'
                }).then(() => {
                    this.router.navigate(['/books']);
                });
            },
            error: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: 'Failed to place order. Please try again.'
                });
                console.error(err);
            }
        });
    }
}

