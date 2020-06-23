<template>
  <div class="home">
    <div class="jumbotron text-center">
      <h1 class="display-3">Auth For Newbs</h1>
      <p class="lead">
        Learning Auth is fun!
      </p>
      <hr class="my-4" />
      <p>
        Sign Up Here
      </p>
      <p class="lead">
        <router-link class="btn btn-primary btn-lg" :to="{ name: 'Signup' }" role="button"
          >Sign Up</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
};
</script>
