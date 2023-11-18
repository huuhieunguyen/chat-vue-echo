<template>
  <router-view />
</template>

<script setup>
import { computed, reactive, onMounted } from 'vue';
import { useHead } from '@vueuse/head';

// Creating dynamic meta tags
const siteData = reactive({
  title: 'My Chat App',
  description: 'My beautiful Chat App',
});

// Using the useHead hook
useHead({
  title: computed(() => siteData.title),
  meta: [
    {
      name: 'description',
      content: computed(() => siteData.description),
    },
  ],
});

// Loading the store data when the app starts
onMounted(async () => {
  await this.$store.commit('initialiseStore');
});
</script>
