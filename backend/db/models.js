const { Schema } = require('mongoose');
const ObjectId = Schema.Types.ObjectId;

const User = new Schema({
  _id: { type: String, alias: 'nickname' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['player', 'admin'], default: 'player' },
  name: String,
  surname: String,
  status: { type: String, required: true, enum: ['active', 'deleted'], default: 'active' },
  division: { type: String, ref: 'Division', required: true },
  teams: [{ type: ObjectId, ref: 'Team' }],
  ownedLeagues: [{ type: ObjectId, ref: 'League' }],
  statistics: {
    matches: {
      won: { type: Number, default: 0 },
      lost: { type: Number, default: 0 },
      ties: {type: Number, default: 0},
    },
    goals: {
      for: { type: Number, default: 0 },
      against: { type: Number, default: 0 },
    },
  },
});

const Team = new Schema({
  name: { type: String, required: true },
  players: {
    first: { type: String, ref: 'User', required: true },
    second: { type: String, ref: 'User', required: true },
  },
  status: { type: String, required: true, enum: ['active', 'deleted'], default: 'active' },
  leagues: [{ type: ObjectId, ref: 'League' }],
  statistics: {
    matches: {
      won: { type: Number, default: 0 },
      lost: { type: Number, default: 0 },
      ties: {type: Number, default: 0},
    },
    goals: {
      for: { type: Number, default: 0 },
      against: { type: Number, default: 0 },
    },
  },
});

const Division = new Schema({
  _id: { type: String, alias: 'name' },
  description: String,
  status: { type: String, required: true, enum: ['active', 'deleted'], default: 'active' },
  leagues: [{ type: ObjectId, ref: 'League' }],
});

const League = new Schema({
  name: { type: String, required: true },
  description: String,
  matchFrequency: { type: Number, default: 0},
  rounds: {type: Number, default: 1},
  division: { type: String, ref: 'Division', required: true },
  owner: { type: String, ref: 'User', required: true },
  teams: [
    {
      team: { type: ObjectId, ref: 'Team', required: true },
      statistics: {
        matches: {
          won: { type: Number, default: 0 },
          lost: { type: Number, default: 0 },
          ties: {type: Number, default: 0},
        },
        goals: {
          for: { type: Number, default: 0 },
          against: { type: Number, default: 0 },
        },
      },
    },
  ],
  status: { type: String, enum: ['created', 'pending', 'closed'], default: 'created' },
  date: {
    created: { type: Date, default: Date.now },
    started: Date,
    closed: Date,
  },
  matches: [{ type: ObjectId, ref: 'Match' }],
});

const Match = new Schema({
  league: { type: ObjectId, ref: 'League', required: true },
  teams: {
    first: { type: ObjectId, ref: 'Team', required: true },
    second: { type: ObjectId, ref: 'Team', required: true },
  },
  status: { type: String, required: true, enum: ['scheduled', 'played', 'aborted'], default: 'scheduled' },
  date: {
    scheduled: { type: Date, required: true },
    played: Date,
    aborted: Date,
  },
  winner: { type: String, enum: ['first', 'second', 'tie'] },
  goals: {
    first: Number,
    second: Number,
  },
});

module.exports = { User, Team, Division, League, Match };
