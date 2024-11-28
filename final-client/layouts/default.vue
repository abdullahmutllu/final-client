<template>
    <div id="app">
        <Navbar  @toggle-sidebar="toggleSidebar" />
        <Sidebar/>
        <main :class="{'content-expanded':sidebarVisible }">
            <slot/>
        </main>
    </div>
</template>
<script setup>
const sidebarVisible = ref(false);
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};
</script>