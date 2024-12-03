<template>
    <div class="app-layout">
      <Navbar 
        :is-sidebar-open="isSidebarOpen" 
        @toggle-sidebar="toggleSidebar" 
      />
      <Sidebar 
        ref="sidebarRef" 
        @sidebar-toggle="updateSidebarState" 
      />
      <main 
        class="main-content" 
        :class="{ 'sidebar-closed': !isSidebarOpen }"
      >
        <NuxtPage />
      </main>
    </div>
  </template>
  
  <script setup>
  const sidebarRef = ref(null)
  const isSidebarOpen = ref(true)
  
  const toggleSidebar = () => {
    if (sidebarRef.value) {
      sidebarRef.value.toggleSidebar()
      isSidebarOpen.value = !isSidebarOpen.value
    }
  }
  
  const updateSidebarState = (state) => {
    isSidebarOpen.value = state
  }
  </script>
  
  <style scoped>
  .app-layout {
    display: flex;
    min-height: 100vh;
  }
  
  .main-content {
    flex-grow: 1;
    margin-left: 200px;
    padding-top: 50px;
    transition: margin-left 0.3s ease;
  }
  
  .main-content.sidebar-closed {
    margin-left: 0;
  }
  
  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
    }
  }
  </style>