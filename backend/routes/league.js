const Joi = require('joi');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { auth, getUser } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { League } = res.locals.models;
  const user = await getUser(res);
  if (!user) return res.status(401).send('Błąd tokena');
  console.log(user)

  const parseJSON = x => {
    try {
      return JSON.parse(x);
    } catch (e) {
      return null;
    }
  };

  const parseReqQuery = query => {
    const status = query.status;
    const _with = parseJSON(query.with);
    return { status, _with };
  };

  const createStatusHandler = status => {
    if (!status) {
      return () => League.find( { division: user.division}).sort('name');
    } else if (status === 'owner') {
      return () => League.find({ owner: user }).sort('name');
    } else {
      return () => League.find({ status, division: user.division }).sort('name');
    }
  };

  const createWithHandler = _with => {
    const has = n => !!_.find(_with, x => x == n);
    const idty = x => x;
    if (!(_with && _with instanceof Array)) {
      return idty;
    }
    let handlers = [];
    if (has('team')) {
      handlers.push(q => q.populate('teams.team'));
    }
    return _.flow(handlers);
  };

  const { status, _with } = parseReqQuery(req.query);
  const statusHandler = createStatusHandler(status);
  const withHandler = createWithHandler(_with);
  const leagues = await _.flow([statusHandler, withHandler])();
  res.json(leagues);
});

router.get('/:id', async (req, res) => {
  const { League } = res.locals.models;

  const league = await League.findByIdOrName(req.params.id);
  if (!league) return res.status(404).send('Nie znaleziono takiej ligi');

  res.json(league);
});

router.get('/:id/matches', async (req, res) => {
  const { League } = res.locals.models;

  const league = await League.findByIdOrName(req.params.id).populate('matches');
  if (!league) return res.status(404).send('Nie znaleziono takiej ligi');

  res.json(league.matches.map(x => _.pick(x, ['teams', 'date', '_id', 'league'])));
});

router.post('/', auth, async (req, res) => {
  const { League } = res.locals.models;

  // console.log(req.body);

  function validate(req) {
    const schema = {
      name: Joi.string()
        .min(3)
        .max(30)
        .required(),
      description: Joi.string()
        .max(255)
        .allow(''),
      rounds: Joi.number()
        .min(1)
        .max(9),
      matchFrequency: Joi.number()
        .min(0)
        .max(7),
      date: Joi.object({
        started: Joi.date()
          .greater('now')
          .required(),
      }),
    };
    return Joi.validate(req, schema);
  }

  const { error, value } = validate(req.body);

  if (error) return res.status(400).json(error.details);

  let league = await res.locals.models.League.findOne({ name: value.name });
  if (league) return res.status(400).send('Taka liga juz istnieje!');

  const user = await getUser(res);
  if (!user) return res.status(401).send('Błąd tokena');

  league = new League({ ...value, owner: user, division: user.division });

  await league.save();
  res.json(league);
});

router.post('/:id/team', auth, async (req, res) => {
  const playersTeamsInLeague = (players, league) =>
    players.reduce((p, x) => {
      const playerTeamsIds = x.teams.map(y => y.toString());
      const leagueTeamsIds = league.teams.map(y => y.team.toString());
      const union = _.intersection(playerTeamsIds, leagueTeamsIds);
      return p && union.length === 0;
    }, true);

  const validate = req => {
    const schema = {
      id: Joi.string()
        .min(24)
        .hex()
        .required(),
    };
    return Joi.validate(req, schema);
  };

  const { League, Team } = res.locals.models;

  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details);
  const team = await Team.findById(value.id)
    .populate('players.first', '-__v -password')
    .populate('players.second', '-__v -password');
  if (!team) return res.status(404).send('Nie znaleziono takiej drużyny');
  if (team.status !== 'active') return res.status(400).send('Ta drużyna została usunięta');

  const league = await League.findByIdOrName(req.params.id);
  if (!league) return res.status(404).send('Nie znaleziono takiej ligi');
  if (league.status !== 'created') return res.status(400).send('Ta liga już wystartowała');

  const players = [team.players.first, team.players.second];
  if (!playersTeamsInLeague(players, league))
    return res.status(400).send('Jesteś już zapisany w tej lidze inną drużyną');

  const session = await Team.startSession();
  await session.withTransaction(async () => {
    league.teams.push({ team });
    team.leagues.push(league);
    await Promise.all([team.save(), league.save()]);
  });

  res.json(await Team.findById(value.id));
});

router.put('/:id/start', auth, async (req, res) => {
  const now = new Date(Date.now());
  const { League, Match } = res.locals.models;

  const league = await League.findByIdOrName(req.params.id);
  if (!league) return res.status(404).send('Nie znaleziono takiej ligi');
  if (league.status !== 'created') return res.status(400).send('Ta liga już wystartowała');

  const user = await getUser(res);
  if (!user) return res.status(401).send('Błąd tokena');
  if (user.nickname != league.owner) return res.status(403).send('Nie możesz edytować tej ligi');


  const matchesData = [];
  let matchDate = new Date(Date.now());
  const teams = _.shuffle(league.teams);
  if (teams.length%2 !== 0) teams.unshift(null);
  const numOfPairs = teams.length/2;
  for (let round = 0; round < league.rounds; round++) {
    const tempTeams = [...teams];
    for (let i = 0; i< tempTeams.length-1; i++) {
      for (y=0; y<numOfPairs; y++) {
        if (tempTeams[y] !== null) {
          matchesData.push({
            league,
            teams: {
              first: tempTeams[y].team,
              second: tempTeams[tempTeams.length-1-y].team,
            },
            date: { scheduled: new Date(matchDate) },
          });
        };
      };
      matchDate.setDate(matchDate.getDate() + league.matchFrequency);
      tempTeams.splice(1,0, ...tempTeams.splice(-1, 1));
    }
  }
  
  const session = await League.startSession();
  await session.withTransaction(async () => {
    const matches = await Match.insertMany(matchesData);
    await league.updateOne({ $push: { matches: matches }, status: 'pending', date: { started: now } });
  });
  res.json(await League.findByIdOrName(req.params.id));
  
});

module.exports = router;
