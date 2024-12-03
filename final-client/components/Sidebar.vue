<template>
  <div 
    id="sidebar" 
    :class="{'sidebar-open': isSidebarOpen, 'sidebar-closed': !isSidebarOpen}"
    class="sidebar bg-dark text-white"
  >
    <div class="sidebar-header d-flex justify-content-between align-items-center p-3">
      <h4 class="sidebar-title m-0">Menu</h4>
    </div>

    <nav class="sidebar-nav">
      <BNav vertical>
        <BNavItem 
          v-for="item in menuItems" 
          :key="item.to" 
          :to="item.to" 
          class="nav-link"
        >
          <component :is="item.icon" class="me-2" />
          {{ item.label }}
        </BNavItem>
      </BNav>
    </nav>

    <div class="sidebar-footer mt-auto p-3">
      <small class="text-muted">© 2024 Your App</small>
    </div>
  </div>
</template>

<script setup>
import { Home, User, Settings } from 'lucide-vue-next'

const isSidebarOpen = ref(true)

const menuItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings }
]

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

defineExpose({ toggleSidebar })
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 200px;
  padding-top: 50px;
  transition: all 0.3s ease;
  overflow-x: hidden;
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-closed {
  transform: translateX(-100%);
  width: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.1);
}
</style>