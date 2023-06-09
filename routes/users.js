var express = require('express');
var router = express.Router();

const User = require('../models/users');

const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// GET /users

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ result: true, length: users.length, users: users });
  } catch (error) {
    res.json({ result: false, error: "An error occurred while retrieving users" });
  }
});

// GET /users/:token

router.get('/:token', async (req, res) => {
  try {
    const user = await User.findOne(req.params.token);
    if (user) {
      res.json({ result: true, user: user });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  } catch (error) {
    res.json({ error: "An error occurred while retrieving the user" });
  }
});

// POST /users/signup/verify

router.post('/signup/verify', async (req, res) => {
  if (!checkBody(req.body, ['username', 'password', 'email'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  try {

    await User.findOne({ email: req.body.email })
      .then(async data => {
        if (data) {
          res.json({ result: false, error: "email already in use" });
        } else {
          await User.findOne({ username: req.body.username })
            .then(data => {
              if (data) {
                res.json({ result: false, error: "username already in use" });
              } else {
                res.json({ result: true, message: "access granted" });
              }
            })
        }
      })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// POST /users/signup

router.post('/signup', async (req, res) => {
  try {
    if (!checkBody(req.body, ['username', 'password', 'email'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }

    // Check if the user has not already been registered
    const data = await User.findOne({ username: req.body.username });

    if (data === null) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        res.json({ result: false, error: 'Invalid email format' });
        return;
      }

      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = await new User({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        city: req.body.city,
        orientation: req.body.orientation,
        gender: req.body.gender,
        token: uid2(32),
        isAdmin: false
      });

       await newUser.save();

      res.json({ result: true, token: newUser.token });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  } catch (error) {
    res.json({ result: false, error: 'Error saving user data' });
  }
});

// POST /users/signin 

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['usernameOrEmail', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const { usernameOrEmail, password } = req.body; // a refaire + commentaire
  User.findOne({
    $or: [
      { username: usernameOrEmail },
      { email: usernameOrEmail }
    ]
  }).then(data => {
    if (data && bcrypt.compareSync(password, data.password)) {
      res.json({
        result: true,
        token: data.token,
        username: data.username,
        email: data.email,
        orientation: data.orientation,
        gender: data.gender
      });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

// DELETE /users 

router.delete('/', async (res) => {
 try{
  await User.deleteMany({})
    .then(data => {
      if (data) {
        res.json({ result: true, message: "Collection users successfully deleted" });
      } else {
        res.json({ result: false, error: "Failed to delete collection users" });
      }
    })
  } catch (error) {
    res.json({ result: false, error: "An error occurred while deleting the user collection" });
  }
});


// DELETE /users/:token

router.delete('/:token', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ token: req.params.token });
    if (user) {
      res.json({ result: true, message: "User successfully deleted" });
    } else {
      res.json({ result: false, error: "Failed to delete user" });
    }
  } catch (error) {
    res.json({ result: false, error: "An error occurred while deleting the user" });
  }
});

// PUT /users/update/:token

router.put('/update/:token', async (req, res) => {
  try {
    await User.updateOne({ token: req.params.token }, {
      orientation: req.body.orientation,
      gender: req.body.gender,
    });

    const updatedUser = await User.findOne({ token: req.params.token });
    res.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
