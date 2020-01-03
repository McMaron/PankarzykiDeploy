const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { User } = res.locals.models;
  const user = await User.findById(id);
  if (!user) res.send('Brak usera o podanym id');
  res.send(user);
});

router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { User } = res.locals.models;
  // const user = await User.findByIdAndUpdate(userId, req.body, {new: true});
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {new: true});
  res.send(user);
});

module.exports = router;
