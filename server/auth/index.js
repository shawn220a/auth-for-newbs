const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

// Validate Data from signup
const schema = Joi.object({
  username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{2,30}$')).required(),
  password: Joi.string().trim().min(8).required(),
});

// All routes in here are pre-pended with /auth

router.get('/', (req, res) => {
  res.json({
    message: '🔐',
  });
});

router.post('/signup', (req, res, next) => {
  const result = schema.validate(req.body);

  if (result.error) {
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
          'Username already Exits. Please create a new one.'
        );
        next(error);
      } else {
        // Hash the password
        bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
          // Insert Username and Password in DB
          const newUser = {
            username: req.body.username,
            password: hashedPassword
          };

          users.insert(newUser).then((insertedUser) => {
            res.json(insertedUser);
          });
        });
      };
    });
});

module.exports = router;
