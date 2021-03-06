const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

// Validate Data from signup
const schema = Joi.object({
  username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{2,30}$')).required(),
  password: Joi.string().trim().min(8).required(),
});

function respondError422(res, next) {
  res.status(422);
  const error = new Error('Unable to login.');
  next(error);
}

function createTokenSendResponse(user, res, next) {
  // Creating JWT
  const payload = {
    _id: user._id,
    username: user.username,
  };

  jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    { expiresIn: '1d' },
    (err, token) => {
      if (err) {
        respondError422(res, next);
      } else {
        res.json({ token });
      }
    },
  );
}

// All routes in here are pre-pended with /auth

router.get('/', (req, res) => {
  res.json({
    message: '🔐',
  });
});

router.post('/signup', (req, res, next) => {
  const result = schema.validate(req.body);

  if (result.error) {
    res.status(422);
    next(result.error);
  }

  users
    .findOne({
      username: req.body.username,
    })
    .then((user) => {
      if (user) {
        // User in DB already, Pick another Username
        const error = new Error(
          'Username already Exits. Please create a new one.',
        );
        res.status(409);
        next(error);
      } else {
        // Hash the password
        bcrypt.hash(req.body.password.trim(), 12).then((hashedPassword) => {
          // Insert Username and Password in DB
          const newUser = {
            username: req.body.username,
            password: hashedPassword,
          };

          users.insert(newUser).then((insertedUser) => {
            delete insertedUser.password;
            res.json(insertedUser);
          });
        });
      }
    });
});

router.post('/login', (req, res, next) => {
  const result = schema.validate(req.body);

  if (result.error) {
    respondError422(res, next);
  }

  users
    .findOne({
      username: req.body.username,
    })
    .then((user) => {
      if (user) {
        // Comparing login password with hashed password
        bcrypt
          .compare(req.body.password, user.password)
          .then((result) => {
            if (result) {
              createTokenSendResponse(user, res, next);
            } else {
              respondError422(res, next);
            }
           });
      } else {
        respondError422(res, next);
      }
    });
});

module.exports = router;
