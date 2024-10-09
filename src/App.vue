<template>
  <div id="app">
    <NavBar></NavBar>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
  },
};
</script>

<style>
html {
  overflow-y: scroll;
}

* {
  font-family: 'Noto Sans KR', sans-serif;
  font-optical-sizing: auto;
  list-style: none;
  text-decoration: none;
  border-collapse: collapse;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  padding: 0;
}
</style>
