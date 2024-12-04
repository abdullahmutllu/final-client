<template>
  <div class="content-wrapper">
    <div class="container-fluid py-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
const contentClasses = ref(['content-default'])
const updateContentClasses = (newClasses) => {
  contentClasses.value = newClasses
}
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