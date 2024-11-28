<template>
    <div class="content">
      <h1>{{ pageTitle }}</h1>
      <slot />
    </div>
  </template>
  
  <script setup>
  defineProps({
    pageTitle: {
      type: String,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  .content {
    padding: 20px;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  </style>