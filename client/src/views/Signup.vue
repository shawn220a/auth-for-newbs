<template>
  <div>
    <h1>Sign Up</h1>

    <!-- Error Message -->
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <!-- Sign Up Form -->
    <form @submit.prevent="signup">
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
          Username minimum of 2 characters and maximum of 30 characters. Can
          include (0-9,a-z,A-Z,_).
        </small>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
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
          <small id="passwordHelp" class="form-text text-muted"
            >Password must be a minimum of 8 charcters.</small
          >
        </div>
        <div class="form-group col-md-6">
          <label for="confirmPassword">Confirm Password</label>
          <input
            v-model="user.confirmPassword"
            type="password"
            class="form-control"
            id="confirmPassword"
            aria-describedby="confirmPasswordHelp"
            placeholder="Password"
            required
          />
          <small id="confirmPasswordHelp" class="form-text text-muted">
            Please confirm your password.
          </small>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Sign Up</button>
    </form>
  </div>
</template>

<script>
import Joi from '@hapi/joi';

const SIGNUP_URL = 'http://localhost:5000/auth/signup';

const schema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9_]{2,30}$'))
    .required(),
  password: Joi.string()
    .trim()
    .min(8)
    .required(),
  confirmPassword: Joi.string()
    .trim()
    .min(8)
    .required(),
});

export default {
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      password: '',
      confirmPassword: '',
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
    signup() {
      this.errorMessage = '';
      if (this.validUser()) {
        // Send data to server
        const body = {
          username: this.user.username,
          password: this.user.password,
        };

        fetch(SIGNUP_URL, {
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
          .then((user) => {
            console.log(user);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Passwords must match.';
        return false;
      }

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

<style></style>
