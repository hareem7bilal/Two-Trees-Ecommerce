import { createApp } from 'vue'
import App from './App.vue'
import './main.css'
import * as VueRouter from 'vue-router'
import ShoppingCartPage from './pages/ShoppingCartPage.vue'
import ProductDetailPage from './pages/ProductDetailPage.vue'
import ProductsPage from './pages/ProductsPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCB7WlsvHC_xWM7HivfWutFRZ26kWz6G00",
  authDomain: "vue-site-482e3.firebaseapp.com",
  projectId: "vue-site-482e3",
  storageBucket: "vue-site-482e3.appspot.com",
  messagingSenderId: "327929552415",
  appId: "1:327929552415:web:e84dcd075ca569d109ff2a"
};

// Initialize Firebase
initializeApp(firebaseConfig);

createApp(App)
.use(VueRouter.createRouter({
    history: VueRouter.createWebHistory(process.env.BASE_URL),
    routes: [{
        path: '/cart',
        component: ShoppingCartPage
    },
    {
        path: '/products',
        component: ProductsPage
    },
    {
        path: '/',
        redirect: '/products'
    },
    {
        path: '/products/:productId',
        component: ProductDetailPage
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFoundPage
    },
]
}))
.mount('#app')
