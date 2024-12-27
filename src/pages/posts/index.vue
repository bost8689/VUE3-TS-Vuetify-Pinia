<template>

  <v-container class="">    
    <v-text-field v-model="searchQuery" label="Поиск" append-icon="mdi-magnify" @input="filteredPosts"
      clearable></v-text-field>
    <v-row>
      <v-col>      
        <v-card  v-for="(post, index) in posts" :key="post.id" :text=post.name class="post-card">
          <v-card-actions>
            <v-row class="d-flex flex-wrap">
              <v-col>
                <v-btn color="primary" @click="goToEditPost(post)">
                  <v-icon left>mdi-pencil</v-icon>
                  Редактировать
                </v-btn>
                <v-btn @click="deletePost(post)" color="red" dark>
                  <v-icon left>
                    mdi-delete
                  </v-icon>
                  Удалить
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>      
      </v-col>
    </v-row>
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
import { useRouter } from 'vue-router';

// определяем переменные
const posts: Ref<Array<Post>> = ref([])
const searchQuery: Ref<String> = ref('')
const postStore = usePostStore();
const router = useRouter();
const hover: Ref<Boolean> = ref(false)

// функция поиска
const filteredPosts = computed(() => {
  if (!searchQuery.value) {
    posts.value = postStore.posts;
  }
  else {
    posts.value = posts.value.filter(post =>
      post.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
});

//переход на страницу изменения поста
const goToEditPost = (post: Post) => {
  router.push({ path: `/posts/edit/${post.id}` });
}
//удалить пост
const deletePost = (post: Post) => {
  postStore.delete(post)
}
//монтирование компонента
onMounted(() => {
  posts.value = postStore.posts;
});

</script>

<style>
.post-card {
  margin-bottom: 16px;
  transition: background-color 0.3s ease;
  transition: border-color 0.3s ease;
}
.post-card:hover {
  border: 1px solid #3f51b5; /* Например, синяя граница */
}
</style>
