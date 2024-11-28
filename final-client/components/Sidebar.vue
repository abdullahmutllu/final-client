<template>
<aside class="sidebar bg-dark text-white" :class="{'sidebar-open':isVisible}">
    <nav>
      <ul class="list-unstyled">
        <li><NuxtLink to="/" class="nav-link">Anasayfa</NuxtLink></li>
        <li><NuxtLink to="/reports" class="nav-link">Raporlar</NuxtLink></li>
        <li><NuxtLink to="/admin" class="nav-link">Yönetim Paneli</NuxtLink></li>
      </ul>
    </nav>
</aside>
</template>
<script>
defineProps({
    isVisible:{
        type:Boolean,
        required:true,
    },
})

</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: -250px;
  width: 250px;
  height: 100vh;
  padding-top: 80px;
  transition: transform 0.3s ease;
}

.sidebar-open {
  transform: translateX(250px);
}

.nav-link {
  display: block;
  padding: 10px;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #575757;
}
</style>