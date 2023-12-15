<template>
  
    <div class="nav">
      <el-menu>
        <router-link to="/"><el-menu-item index="home" class="nav-item">Home</el-menu-item></router-link>
        <router-link to="/"><el-menu-item v-if="isLoggedIn" @click="logout" index="home" class="nav-item">Logout</el-menu-item></router-link>

        <router-link to="/login" v-if="!isLoggedIn"><el-menu-item index="login" class="nav-item">Login</el-menu-item></router-link>
        <router-link to="/register" v-if="!isLoggedIn"><el-menu-item index="register" class="nav-item">Register</el-menu-item></router-link> 
      </el-menu>
    </div>
    <h1 v-if="isLoggedIn">Welcome <span id="userName">{{ loggedInUser.name }}</span></h1>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script>
import Game from './components/Game.vue';
import { ElMenu, ElMenuItem } from 'element-plus';
import { mapGetters } from 'vuex';

export default {
  data () {
    return {
    }
  },
  mounted() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.$store.commit('SET_USER', parsedUser)
      // console.log('Logged In User Name:', parsedUser.name);

    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'loggedInUser']),
  },
  methods: {
    logout() {
      this.$store.dispatch('logoutUser')
        .then(() => {
          this.$router.push('/login');
        })
        .catch((error) => {
          console.error('Logout failed:', error);
        });
    },
  },
  components: {
    Game,
    ElMenu,
    ElMenuItem,
  },
};
</script>


<style scoped>

#userName {
  color: #646cff;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
