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
    post: <Post>{ id: '', name: '' }, //шпблон поста
    posts: <Array<Post>>[],
    postsForFind: <Array<Post>>[],
    currentPage: 0,
    pageSize: 10, // количество постов на одну порцию
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

    // ленивая загрузка
    loadPostMore(){
      // Вычисление индекса начала и конца для порции данных
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      // Добавление новой порции постов в состояние 
      this.posts.push.apply(this.posts, loadState('posts').slice(start, end))          
      // Увеличение номера текущей страницы
      this.currentPage++;
    },

    // поиск постов
    findPost(){
      // Вычисление индекса начала и конца для порции данных
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      // Добавление новой порции постов в состояние 
      this.posts.push.apply(this.posts, loadState('posts').slice(start, end))          
      // Увеличение номера текущей страницы
      this.currentPage++;
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
              
          saveState('posts', data.posts);
          this.loadPostMore()   
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      // проверяем, как надо первоначально загрузить из файла или из хранилища
      if (loadState('posts') == null) {
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
