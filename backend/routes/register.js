const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

router.post('/', async (req, res) => {
  const { User, Division } = res.locals.models;
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details);

  const userEmail = await User.findOne({ email: value.email });
  if (userEmail) return res.status(400).send('Email zajęty!');

  const userLogin = await User.findOne({ _id: value.nickname });
  if (userLogin) return res.status(400).send('Login zajęty!');

  const userDivision = await Division.findOne({ _id: value.division });
  if (!userDivision) return res.status(400).send('Podana dywizja nie istnieje!');

  const user = new User(_.pick(value, ['nickname', 'email', 'password', 'name', 'surname', 'division']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.json(_.pick(user, ['nickname', 'email', 'name', 'surname']));
});

function validate(req) {
  const schema = {
    nickname: Joi.string()
      .min(4)
      .max(30)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(32)
      .required(),
    name: Joi.string().max(32),
    surname: Joi.string().max(32),
    division: Joi.string()
      .max(32)
      .required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
