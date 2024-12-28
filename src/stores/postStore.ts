// Импорт функции `defineStore` из библиотеки Pinia для создания нового хранилища.
import { defineStore } from 'pinia'

// Импортируем тип данных `Post`, который будет использоваться для типизации постов.
import type { Post } from '../types/postType';


// Определяем и экспортируем хранилище `postStore` с помощью функции `defineStore`.
export const usePostStore = defineStore('postStore', {
  // Определяем начальное состояние хранилища.
  state: () => ({
    post: <Post>{ id: '', name: '' }, //для инициализации начального состония поста
    posts: <Array<Post>>[], // посты для отображения на фроне
    searchPosts: <Array<Post>>[], // найденные посты по запросам
    currentPage: 0, // страница для пагинации данных
    pageSize: 10, // количество постов на одну порцию
  }),
  // Определяем действия, которые могут изменять состояние хранилища.
  actions: {

    // функция загрузки из LocalStorage
    loadState(key: string) {
      try {
        const serializedState = localStorage.getItem(key);
        return serializedState === null ? undefined : JSON.parse(serializedState);
      } catch (err) {
        console.error('Ошибка загрузки состояния из localStorage:', err);
        return undefined;
      }
    },

    // Функция сохранения состояния в localStorage
    saveState(key: string, state: Array<Post>) {
      try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(key, serializedState);
      } catch (err) {
        console.error('Ошибка сохранения состояния в localStorage:', err);
      }
    },

    // Метод для удаления поста из списка по его индексу.
    delete(post: Post) {

      // удаление из фронта
      let index = this.posts.findIndex((obj: Post) => obj.id === post.id);
      this.posts.splice(index, 1);

      // удаление из storage
      const posts = this.loadState('posts');
      index = posts.findIndex((obj: Post) => obj.id === post.id);
      posts.splice(index, 1);
      this.saveState('posts', posts);
    },

    // Метод для добавления нового поста в начало списка.
    create(post: Post) {

      // добавляю в local storage
      const posts = this.loadState('posts');
      posts.unshift(post);
      this.saveState('posts', posts);

      // добавляю на фронт
      this.posts.unshift(post);

    },

    // Метод для обновления поста в списке по его индексу на новый пост.
    update(post: Post) {

      // обновляю на фронте
      let index = this.posts.findIndex((obj: Post) => obj.id === post.id);      
      this.posts[index] = post;

      // обновляю в storage
      const posts = this.loadState('posts');
      index = posts.findIndex((obj: Post) => obj.id === post.id);
      posts[index] = post;
      this.saveState('posts', posts);

    },

    // ленивая загрузка постов из хранилища
    loadPostMore() {
      // Вычисление индекса начала и конца для порции данных      
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      // Добавление новой порции постов в состояние 
      this.posts.push.apply(this.posts, this.loadState('posts').slice(start, end))
      // Увеличение номера текущей страницы
      this.currentPage++;
    },

    // ленивая загрузка посто из найденных
    loadSearchPostMore() {
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      // Добавление новой порции постов в состояние 
      this.posts.push.apply(this.posts, this.searchPosts.slice(start, end))
      // Увеличение номера текущей страницы
      this.currentPage++;     
    },

    // Инициализация состояния
    initialize() {
      this.currentPage=0;
      this.posts=[];
      const fetchData = async () => {
        console.log('fetchData')
        try {
          const response = await fetch(new URL('@/assets/posts.json', import.meta.url).href);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          this.saveState('posts', data.posts);
          this.loadPostMore()
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      // проверяем, как надо первоначально загрузить из файла или из хранилища
      if (this.loadState('posts') == null) {
        fetchData()
      }
      else {
        this.loadPostMore()
      }

    },
  },
})

const postStore = usePostStore();
postStore.initialize();
