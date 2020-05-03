<template>
  <div>
    <h1>Sign Up</h1>
    <!-- Sign Up Form -->
    <form>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="username"
          class="form-control"
          id="username"
          aria-describedby="usernameHelp"
          placeholder="Enter a username"
        />
        <small id="usernameHelp" class="form-text text-muted"
          >Username Min of 2 characters and Max is 30 characters. Can include (0-9, a-z, A-Z)</small
        >
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          placeholder="Password"
        />
        <small id="passwordHelp" class="form-text text-muted"
          >Password must be a minimum of 8 charcters.</small
        >
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
