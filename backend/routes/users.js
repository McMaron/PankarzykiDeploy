const express = require('express');
const router = express.Router();
const { auth, getUser } = require('../middleware/auth');
const _ = require('lodash');

router.use('/', auth);

router.get('/', async (req, res) => {
  const { User } = res.locals.models;
  const { division } = req.query;

  const users = await User.find().sort('name');
  if (division) {
    const newUsers = users.filter(user => user.division === division);
    res.json(newUsers);
  } else {
    res.json(users);
  }
});

router.get('/:id/:team', async (req, res) => {
  const user = await getUser(res, req.params.id).populate({ path: 'teams', match: { status: 'active' } });
  res.json(user.teams.map(x => _.pick(x, ['players', 'name', '_id', 'leagues', 'statistics'])));
});

module.exports = router;
