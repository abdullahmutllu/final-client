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
  
        <div class="navbar-search-container">
          <form class="d-flex">
            <input 
              class="form-control me-2" 
              type="search" 
              placeholder="Search" 
              aria-label="Search"
            />
            <button class="btn btn-search" type="submit">
              Search
            </button>
          </form>
        </div>
  
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
    background-color: #dfdffb; /* Soft deep purple-blue */
    height: 50px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1050;
    color: #f4f4f8; 
  }
  
  .btn-sidebar-toggle {
    background: rgba(255,255,255,0.2);
    border: none;
    color: #f4f4f8;
    transition: background-color 0.3s ease;
  }
  
  .btn-sidebar-toggle:hover {
    background: rgba(255,255,255,0.3);
  }
  
  .btn-search {
    background-color: #6a5acd; /* Soft slate blue */
    color: white;
    border: none;
    transition: background-color 0.3s ease;
  }
  
  .btn-search:hover {
    background-color: #5a4abd;
  }
  
  .navbar-search-container .form-control {
    background-color: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #f4f4f8;
  }
  
  .navbar-search-container .form-control::placeholder {
    color: rgba(244,244,248,0.7);
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