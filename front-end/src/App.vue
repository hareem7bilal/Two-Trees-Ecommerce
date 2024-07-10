<template>
  <NavBar :user = "user"/>
  <div class="page-wrap">
    <router-view :user = "user">
    </router-view>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'App',
  components: {
    NavBar,
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, user=>{
      this.user = user;
    })
  },
  data(){
    return {
      user: null
    }
  }
}
</script>