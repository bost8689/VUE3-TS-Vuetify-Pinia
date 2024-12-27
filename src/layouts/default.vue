<template>
  <v-app>
    
    <v-theme-provider theme="dark" with-background class="d-flex sticky-top">
      <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon @click="toggleDrawer" class="d-none d-md-flex"></v-app-bar-nav-icon>
        <v-toolbar-title></v-toolbar-title>
      </v-app-bar>
    </v-theme-provider>

    <v-navigation-drawer v-model="drawer" app class="pa-2">
      <v-theme-provider theme="dark" with-background class="">
        <v-btn color="success" @click="goToPosts" block>         
          Посты
        </v-btn>
      </v-theme-provider>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-theme-provider theme="dark" with-background class="d-flex pb-3 pt-3 sticky-bottom">
      <v-footer app padless class="d-flex justify-end">
        <v-btn @click="toggleDrawer"><v-icon>mdi-menu</v-icon></v-btn>       
      </v-footer>
    </v-theme-provider>

  </v-app>
</template>

<script lang="ts" setup>

// определяем переменные
const drawer = ref(false);
const router = useRouter();

// переход на страницу постов
const goToPosts = () => {
  router.push({ path: `/posts` });

}

// проверка на состояния боковой панели
function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>
<style>
.sticky-bottom {
  position: sticky;
  bottom: 0;
}
</style>