<template>
  <v-app>

    <v-theme-provider theme="dark" with-background class="d-flex sticky-top">
      <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon @click="toggleDrawer" class="d-none d-md-flex"></v-app-bar-nav-icon>
        <v-toolbar-title></v-toolbar-title>
      </v-app-bar>
    </v-theme-provider>

    <v-main>

      <v-navigation-drawer v-model="drawer" class="pa-2 fixed-drawer">
        <v-btn v-if="!isRoutePosts" color="success" @click="goToPosts" block>
          Посты
        </v-btn>
        <v-btn v-if="isRoutePosts" color="success" @click="goToCreatePost" block>
          <v-icon left>mdi-plus</v-icon>
          Добавить
        </v-btn>
      </v-navigation-drawer>

      <!-- <router-view /> -->
      <router-view v-slot="{ Component }">
        <keep-alive include="index">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </v-main>

    <v-theme-provider theme="dark" with-background class="d-md-none pb-3 pt-3 sticky-bottom">
      <v-footer app padless class="justify-space-between">
        <v-btn @click="goToMain"><v-icon>mdi-home</v-icon></v-btn>
        <v-btn @click="toggleDrawer"><v-icon>mdi-menu</v-icon></v-btn>
      </v-footer>
    </v-theme-provider>

  </v-app>


</template>

<script lang="ts" setup>

import { useRouter, useRoute } from 'vue-router'
const drawer = ref(false);
const router = useRouter();
const route = useRoute();
const goToPosts = () => {
  router.push({ path: `/posts` });
}
// отслеживает маршрут
const goToCreatePost = () => {
  router.push({ path: `/posts/create` });

}
const goToMain = () => {
  router.push({ path: `/` });

}
function toggleDrawer() {
  drawer.value = !drawer.value;
}

// отслеживает маршрут
const isRoutePosts = computed(() => {
  return route.name === '/posts/';
});

</script>
<style>

.sticky-bottom {
  position: sticky;
  bottom: 0;
  z-index: 1000;
}

.sticky-top {
  z-index: 1000;
  position: sticky;
  top: 0;
}

.fixed-drawer {
  position: fixed !important;
  /* Фиксируем позицию ящика */
  overflow: hidden;
  /* Отключаем прокрутку */
}
</style>