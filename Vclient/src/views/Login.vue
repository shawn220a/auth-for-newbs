<template>
  <div>
    <h1>Log In</h1>

    <!-- Loading Image -->
    <div v-if="loggingIn">
      <img src="../assets/Infinity-1s-200px.svg" />
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <!-- Log In Form -->
    <form v-if="!loggingIn" @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          v-model="user.username"
          type="username"
          class="form-control"
          id="username"
          aria-describedby="usernameHelp"
          placeholder="Enter a username"
          required
        />
        <small id="usernameHelp" class="form-text text-muted">
          Enter username to login.
        </small>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="user.password"
          type="password"
          class="form-control"
          id="password"
          aria-describedby="passwordHelp"
          placeholder="Password"
          required
        />
        <small id="passwordHelp" class="form-text text-muted">
          Enter a password to login.
        </small>
      </div>
      <button type="submit" class="btn btn-primary">Log In</button>
    </form>
  </div>
</template>

<script>
import Joi from '@hapi/joi';

const LOGIN_URL = 'http://localhost:5000/auth/login';

const schema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9_]{2,30}$'))
    .required(),
  password: Joi.string()
    .trim()
    .min(8)
    .required(),
});

export default {
  data: () => ({
    loggingIn: false,
    errorMessage: '',
    user: {
      username: '',
      password: '',
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    login() {
      this.errorMessage = '';
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
        };

        fetch(LOGIN_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            return response.json().then((error) => {
              throw new Error(error.message);
            });
          })
          .then((result) => {
            localStorage.token = result.token;
            setTimeout(() => {
              this.loggingIn = false;
              this.$router.push('/dashboard');
            }, 1000);
          })
          .catch((err) => {
            setTimeout(() => {
              this.loggingIn = false;
              this.errorMessage = err.message;
            }, 1000);
          });
      }
    },
    validUser() {
      const result = schema.validate(this.user);

      if (result.error) {
        if (result.error.message.includes('username')) {
          this.errorMessage = 'Username is invalid.';
        } else {
          this.errorMessage = 'Password is invalid.';
        }

        return false;
      }

      return true;
    },
  },
};
</script>

<style>
</style>
