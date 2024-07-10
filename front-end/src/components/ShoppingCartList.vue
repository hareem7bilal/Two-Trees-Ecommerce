<template>
    <div v-for="product in cartItems" :key="product.id" class="product-container">
        <img :src="product.imageUrl" class="product-image" />
        <div class="details-wrap">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">{{ product.price }}</p>
        </div>
        <button @click="$emit('remove-from-cart', product.id)" class="remove-button">Remove from Cart</button>
    </div>
</template>

<script>

export default {
    name: "ShoppingCartList",
    props: ['cartItems'],
}
</script>