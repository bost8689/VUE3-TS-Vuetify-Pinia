<template>
  <v-container>
    <v-textarea v-model="post.name" label="Пост"></v-textarea>
    <v-btn color="success" @click="updatePost">      
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
import { useRouter, useRoute } from 'vue-router'

// определяем переменные
const router = useRouter()
const route = useRoute()
const postStore = usePostStore();
const post: Ref<Post> = ref(JSON.parse(JSON.stringify(postStore.post)))

// проверка есть в маршруте id
if ('id' in route.params) {  
  const post_id = route.params.id  
  var find_post = postStore.posts.find(item => item.id === post_id)
  
  if (find_post != null){
    post.value = JSON.parse(JSON.stringify(find_post))    
  }
  else{    
    router.push({ path: `/posts` });
  }
}

// обновления поста
const updatePost = () => {  
  console.log('updatePost')
  postStore.update(post.value)
  router.push({ path: `/posts` });
}

</script>
<style></style>
