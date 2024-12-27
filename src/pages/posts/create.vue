<template>

  <v-container>
    <v-textarea v-model="post.name" label="Пост"></v-textarea>
    <v-btn color="success" @click="createPost">
      Сохранить
    </v-btn>
  </v-container>

</template>
<route lang="yaml">
  meta:
    layout: postLayout
</route>
<script lang="ts" setup>

import type { Post } from '@/types/postType';
import { ref, onMounted } from 'vue';
import { usePostStore } from '@/stores/postStore'; // Импортируйте ваш store
import { useRouter } from 'vue-router'

// определяем переменные
const router = useRouter()
const postStore = usePostStore();
const post: Ref<Post> = ref(JSON.parse(JSON.stringify(postStore.post)))

// функция генерация id
function generateUniqueCode(length = 20) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }
  return result.toLowerCase();
}

// создание постав
const createPost = () => {
  // формирую новый id
  post.value.id = generateUniqueCode()
  postStore.create(post.value)
  // переходим на страницу постов
  router.push({ path: `/posts` });
}
</script>
<style></style>
