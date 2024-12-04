<template>
    <b-modal v-model="isVisible" :title="title" size="lg">
      <div>
        <slot></slot>
      </div>
      <template #modal-footer>
        <b-button variant="secondary" @click="close">Kapat</b-button>
        <b-button variant="primary" @click="save">Kaydet</b-button>
      </template>
    </b-modal>
  </template>
  
  <script setup>  
  const isVisible = ref(false)
  const title = ref('Modal Basligi')
  
  const close = () => {
    isVisible.value = false
  }
  
  const save = () => {
    console.log('Kaydedildi')
    isVisible.value = false
  }
  
  const openModal = (modalTitle) => {
    title.value = modalTitle
    isVisible.value = true
  }
  
  defineExpose({
    openModal
  })
  </script>
  
  <style scoped>

  </style>
  