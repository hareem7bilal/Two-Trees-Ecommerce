<template>
    <h1>Shopping Cart Page</h1>
    <div v-if="cartItems.length > 0">
        <ShoppingCartList @remove-from-cart="removeFromCart($event)" :cartItems="cartItems" />
        <button class="checkout-button">Proceed to Checkout</button>
    </div>
    <div v-if="cartItems.length === 0">
        You currently have no items in your cart!
    </div>

</template>

<script>
import ShoppingCartList from '@/components/ShoppingCartList.vue';
import axios from 'axios';
//import { cartItems } from '@/temp-data';
export default {
    name: 'ShoppingCartPage',
    components: {
        ShoppingCartList,
    },
    props: ['user'],
    data() {
        return {
            cartItems: [],
        }
    },
    watch: {
        async user(newUserValue) {
            if (newUserValue) {
                const cartRes = await axios.get(`/api/users/${this.user.uid}/cart`);
                const cartItems = cartRes.data;
                this.cartItems = cartItems;
            }

        }

    },
    methods: {
        async removeFromCart(productId) {
            const res = await axios.delete(`/api/users/${this.user.uid}/cart/${productId}`);
            const updatedCart = res.data;
            this.cartItems = updatedCart;
        }
    },
    async created() {
        if (this.user) {
            const res = await axios.get(`/api/users/${this.user.uid}/cart`);
            const cartItems = res.data;
            this.cartItems = cartItems;
        }

    }
}
</script>