<template>

  <v-container class="">
    <v-text-field v-model="searchQuery" label="Поиск" append-icon="mdi-magnify" @input="filteredPosts"
      clearable  
    @click:clear="filteredPosts"></v-text-field>

    <v-row>
      <v-col>
        <v-card v-for="(post, index) in posts" :key="post.id" :text=post.name class="post-card">
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


        <!-- <button @click="loadMorePosts">Загрузить еще</button> -->
      </v-col>
    </v-row>
    <!-- Интерсект элемент для загрузки дополнительных постов -->

    <!-- <v-intersect @intersect="loadMorePosts">
      <div style="height: 1px;"></div>
    </v-intersect> -->
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
const isBottom: Ref<Boolean> = ref(false)

// функция поиска
const filteredPosts = () => {
  // если строка пуста
  if (!searchQuery.value) {   
    postStore.initialize();
    posts.value = postStore.posts;
  }
  else {
    // осуществляем поиск постов из хранилища
    postStore.searchPosts = postStore.loadState('posts').filter((post: Post) =>
      post.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    // загружаем посты на фронт порциями
    postStore.posts = [];
    postStore.currentPage = 0;
    postStore.loadSearchPostMore()
    posts.value = postStore.posts    
  }
};

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
  window.addEventListener('scroll', () => {

    // Рассчитываем, докрутили ли страницу до конца
    const bottomOfWindow = document.documentElement.scrollTop + 2000 + window.innerHeight >= document.documentElement.offsetHeight;
    isBottom.value = bottomOfWindow;
    if (bottomOfWindow) {
      // подгружаем данные      
      if (!searchQuery.value) {
        postStore.loadPostMore();
      }
      else{
        postStore.loadSearchPostMore();
      }
    }
  });

});

</script>

<style>
.post-card {
  margin-bottom: 16px;
  transition: background-color 0.3s ease;
  transition: border-color 0.3s ease;
}

.post-card:hover {
  border: 1px solid #3f51b5;
  /* Например, синяя граница */
}
</style>
