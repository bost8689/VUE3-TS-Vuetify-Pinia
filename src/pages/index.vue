<template>

  <v-container>
    <v-card>
      Добро пожаловать!
    </v-card>
  </v-container>

</template>

<script lang="ts" setup>

import type { Post } from '@/types/postType';
import { ref, onMounted } from 'vue';
import { usePostStore } from '@/stores/postStore'; // Импортируйте ваш store
import { useRouter } from 'vue-router';
const postStore = usePostStore();
const router = useRouter();
</script>

