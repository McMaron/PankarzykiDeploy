const express = require('express');
const router = express.Router();
const { auth, getUser } = require('../middleware/auth');

router.get('/', (req, res) => {
  const Model = res.locals.models.Team;
  getTeams(Model).then(result => {
    if (!result.length) {
      res.status(404).send(`Nie znaleziona żadnych drużyn.`);
    } else {
      res.send(result);
    }
  });
});

router.get('/:id', (req, res) => {
  const Model = res.locals.models.Team;
  getTeams(Model, req.params.id).then(result => {
    if (!result) {
      res.status(404).send(`Nie znaleziono drużyny o _ID ${req.params.id}.`);
    } else {
      res.send(result);
    }
  });
});

router.put('/:id', (req, res) => {
  const Model = res.locals.models.Team;
  getTeams(Model, req.params.id).then(result => {
    if (!result) {
      res.status(404).send(`Nie znaleziono drużyny o _ID ${req.params.id}.`);
    } else {
      // console.log(result);
      Model.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
        r => {
          res.send(`Zaktualizowano dane drużyny ${r.name}:\n${r}`);
        },
        err => {
          console.log(err.errmsg);
          res.status(403).send('Bad request!');
        },
      );
    }
  });
});

router.delete('/:id', async (req, res) => {
  const Model = res.locals.models.Team;
  const user = await getUser(res);

console.log(user);

  // if (!user) return res.status(401).send('Błąd tokena');

  getTeams(Model, req.params.id).then(result => {
    if (!result) {
      res.status(404).send(`Nie znaleziono drużyny o _ID ${req.params.id}.`);
    } else {
      // Team.deleteOne( { id: req.params.id } ).then( (result) => {
      Model.deleteOne({ _id: req.params.id }).then(result => {
        if (result.n) {
          res.send(`Drużyna o _ID ${req.params.id} usunięta.`);
        } else {
          res.status(500).send(`Nic się nie wydarzyło...`);
        }
      });
    }
  });
});

router.post('/', auth, async (req, res) => {
  const Model = res.locals.models.Team;
  const teamName = req.body.name;
  const playersFirst = req.body.players.first;
  const playersSecond = req.body.players.second;
  const status = req.body.status;

  const user = await getUser(res);
  if (!user) return res.status(401).send('Błąd tokena');

  createTeam(Model, teamName, playersFirst, playersSecond, status).then(
    result => {
      // console.log('res-> ', result);
      res.send(result);
    },
    err => {
      console.log('Coś poszło nie tak (POST)...', err);
      res.status(400).send('Bad request');
    },
  );
});

async function createTeam(Team, name, player1, player2, status) {
  const team = new Team({
    name: name,
    players: { first: player1, second: player2 },
    status: status,
  });
  return await team.save().then(
    res => {
      // console.log(res);
      return res;
    },
    err => {
      console.log('Coś poszło nie tak (createTeam):', err.errmsg);
      return err.errmsg;
    },
  );
}

async function getTeams(Team, id) {
  if (id) {
    // return await Team
    return await Team.find({ _id: id })
      // .populate('regionId', 'name id -_id')
      // .populate('playersId')
      .populate('players.first')
      .populate('players.second')
      .populate('leagues')
      .then(
        result => {
          return result[0];
        },
        err => console.log('Something went wrong...', err),
      );
  } else {
    // return await Team
    return await Team.find()
      // .populate('regionId', 'name id -_id')
      // .populate('playersId')
      .populate('players.first')
      .populate('players.second')
      .populate('leagues')
      .then(
        result => {
          return result;
        },
        err => console.log('Something went wrong...', err),
      );
  }
}

module.exports = router;
