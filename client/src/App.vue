<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <router-link class="navbar-brand" :to="{ name: 'Home' }">Auth For Newbs</router-link>
    </nav>
    <router-view class="container pt-5"/>
  </div>
</template>

<style></style>
