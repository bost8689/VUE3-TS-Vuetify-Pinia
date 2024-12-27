// Импорт функции `defineStore` из библиотеки Pinia для создания нового хранилища.
import { defineStore } from 'pinia'

// Импортируем тип данных `Post`, который будет использоваться для типизации постов.
import type { Post } from '../types/postType';

// функция загрузки из LocalStorage
function loadState(key: string) {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch (err) {
    console.error('Ошибка загрузки состояния из localStorage:', err);
    return undefined;
  }
}

// Функция сохранения состояния в localStorage
function saveState(key: string, state: Array<Post>) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error('Ошибка сохранения состояния в localStorage:', err);
  }
}

// Определяем и экспортируем хранилище `postStore` с помощью функции `defineStore`.
export const usePostStore = defineStore('postStore', {
  // Определяем начальное состояние хранилища.
  state: () => ({
    post: <Post>{ id: '', name: '' },
    posts: <Array<Post>>[],
  }),
  // Определяем действия, которые могут изменять состояние хранилища.
  actions: {
    // Метод для удаления поста из списка по его индексу.
    delete(post: Post) {
      const index = this.posts.indexOf(post);
      this.posts.splice(index, 1);
      saveState('posts', this.posts);
    },

    // Метод для добавления нового поста в начало списка.
    create(post: Post) {
      this.posts.unshift(post);
      saveState('posts', this.posts);
    },

    // Метод для обновления поста в списке по его индексу на новый пост.
    update(post: Post) {
      const index = this.posts.findIndex(obj => obj.id === post.id);
      console.log(index)
      this.posts[index] = post;
      saveState('posts', this.posts);
    },

    // Инициализация состояния
    initialize() {
      const fetchData = async () => {
        console.log('fetchData')
        try {
          const response = await fetch(new URL('@/assets/posts.json', import.meta.url).href);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          this.posts = data.posts;
          saveState('posts', data.posts);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      // проверяем, как надо загрузить из файла или из хранилища
      if (loadState('posts') == null) {
        fetchData()
      }
      else {
        postStore.posts = loadState('posts');
      }

    },
  },
})

const postStore = usePostStore();
postStore.initialize();
