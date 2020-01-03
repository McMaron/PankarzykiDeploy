const { auth, getUser } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await getUser(res);
  res.json(user);
});

router.post('/', async (req, res) => {
  function validate(req) {
    const schema = {
      email: Joi.string()
        .min(5)
        .max(255)
        .required()
        .email(),
      password: Joi.string()
        .min(5)
        .max(1024)
        .required(),
    };

    return Joi.validate(req, schema);
  }

  const { error, value } = validate(req.body);
  if (error) return res.status(400).json(error.details);

  let user = await res.locals.models.User.findOne({
    email: value.email,
  });
  if (!user) return res.status(400).send('Błędny email lub hasło');

  const validPassword = await bcrypt.compare(value.password, user.password);
  if (!validPassword) return res.status(400).send('Błędny email lub hasło');

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWTPRIVATEKEY,
  );

  res.header('x-auth-token', token).send(_.pick(user, ['email']));
});

module.exports = router;
