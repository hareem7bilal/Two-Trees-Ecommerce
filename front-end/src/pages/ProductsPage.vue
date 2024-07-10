<template>
    <h1>Products</h1>
    <ProductsList :products="products"/>
</template>

<script>
//import { products } from '@/temp-data';
import axios from 'axios';
import ProductsList from '../components/ProductsList.vue';

export default {
    name: "ProductsPage",
    components: {
        ProductsList,
    },
    data() {
        return {
            products: [],
        }
    },
    async created(){
        const res = await axios.get('/api/products');
        const products = res.data;
        this.products = products;
    }
}
</script>