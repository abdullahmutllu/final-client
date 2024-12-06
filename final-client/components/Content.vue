<template>
  <div class="content-wrapper">
    <div class="container-fluid py-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
</script>
<style scoped>
.content-wrapper {
top: 0;
left: 0;
}
@media (max-width: 768px) {
  .content-wrapper {
    margin-left: 0;
  }
}
</style>