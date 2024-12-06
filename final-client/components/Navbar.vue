<template>
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <button 
          @click="$emit('toggle-sidebar')" 
          class="btn btn-sidebar-toggle"
        >
          <ChevronLeft v-if="isSidebarOpen" />
          <ChevronRight v-else />
        </button>
        <div class="navbar-actions">
          <BDropdown variant="link">
            <template #button-content>
              <img 
                src="../assets/img/profile.jpg" 
                alt="User" 
                class="user-avatar"
              />
            </template>
            <BDropdownItem>Profile</BDropdownItem>
            <BDropdownItem>Logout</BDropdownItem>
          </BDropdown>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  const props = defineProps({
    isSidebarOpen: {
      type: Boolean,
      default: true
    }
  })
  
  defineEmits(['toggle-sidebar'])
  </script>
  
  <style scoped>
  .navbar {
    background-color: #ebebf3; 
    height: 50px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1050;
    color: #f4f4f8; 
  }
  
  .btn-sidebar-toggle {
    background: rgba(211, 0, 0, 0.2);
    border: none;
    color: #f4f4f8;
    transition: background-color 0.3s ease;
  }
  
  .btn-sidebar-toggle:hover {
    background: rgba(255,255,255,0.3);
  }
  
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
  }
  
  @media (max-width: 768px) {
    .navbar-search-container {
      flex-grow: 1;
    }
  }
  </style>