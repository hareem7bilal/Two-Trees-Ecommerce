<template>
    <div v-if="product">
        <div class="img-wrap">
            <img :src="product.imageUrl" />
        </div>
        <div class="product-details">
            <h1>{{ product.name }}</h1>
            <h3 class="price">{{ product.price }}</h3>
            <button @click="addToCart" v-if="user && !itemIsInCart" class="add-to-cart">Add to Cart</button>
            <button v-if="user && itemIsInCart" class="grey-button">Item is already in cart</button>
            <button v-if="!user" @click="signIn" class="sign-in">Sign in to add to cart</button>
        </div>
    </div>
    <div v-else>
        <NotFoundPage />
    </div>

</template>

<script>
//import { products } from '@/temp-data';
import axios from 'axios';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
//import { cartItems } from '@/temp-data';
export default {
    name: 'ProductDetailPage',
    components: {
        NotFoundPage,
    },
    props: ['user'],
    data() {
        return {
            product: {},
            cartItems: []
        }
    },
    computed: {
        itemIsInCart() {
            return this.cartItems.some(item => item.id === this.$route.params.productId);
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
        async addToCart() {
            await axios.post(`/api/users/${this.user.uid}/cart`, {
                id: this.$route.params.productId,
            });
            alert("Successfully added item to cart!")
        },
        async signIn() {
            const email = prompt('Please enter your email to sign in: ');
            const auth = getAuth();
            const actionCodeSettings = {
                url: `http://localhost:8080/products/${this.$route.params.productId}`,
                handleCodeInApp: true,
            };
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            alert('A login link was sent to the email you provided');
            window.localStorage.setItem('emailForSignIn', email);

        }
    },
    async created() {
        const auth = getAuth();
        if (isSignInWithEmailLink(auth, window.location.href)) {
            const email = window.localStorage.getItem('emailForSignIn');
            await signInWithEmailLink(auth, email, window.location.href);
            alert('Successfully signed in!');
            window.localStorage.removeItem('emailForSignIn');
        }

        const res = await axios.get(`/api/products/${this.$route.params.productId}`);
        const product = res.data;
        this.product = product;

        if (this.user) {
            const cartRes = await axios.get(`/api/users/${this.user.uid}/cart`);
            const cartItems = cartRes.data;
            this.cartItems = cartItems;
        }
    }
}
</script>