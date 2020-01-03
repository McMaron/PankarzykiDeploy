const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const db = require('./db');
const routerHome = require('./routes/home');
const routerLeague = require('./routes/league');
const routerTeams = require('./routes/teams');
const routerMatch = require('./routes/match');
const routerRegister = require('./routes/register');
const routerLogin = require('./routes/login');
const routerUsers = require('./routes/users');
const routerUser = require('./routes/user');
const routerDivision = require('./routes/division');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const main = async () => {
  const app = express();

  if (!process.env.JWTPRIVATEKEY) {
    console.error('jwtPrivateKey not defined');
    process.exit(1);
  }

  // Database configuration
  const connection = await db.connect();
  const models = db.load(connection);
  if (process.env.NODE_ENV === 'dev') {
    // if (process.env.TEST_ENV || process.env.NODE_ENV) {
    if (process.env.DB_INIT === 'yes') {
      // await connection.dropDatabase();
      let stats;
      stats = await connection.collections.divisions.stats();
      if (stats.count > 0) {
        await connection.collections.divisions.drop();
      }
      stats = await connection.collections.users.stats();
      if (stats.count > 0) {
        await connection.collections.users.drop();
      }
      await db.initialize(models);
    }
  }

  db.register(app, connection, models);

  // Global middlewares
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(logger);

  // Routes
  //
  app.use(express.static(path.join(__dirname, 'client/build')))
  app.get('/*', (req, res)=> res.sendFile(path.join(__dirname,'client/build', 'index.html')))
  app.use('/', routerHome);
  app.use('/api/register', routerRegister);
  app.use('/api/login', routerLogin);
  app.use('/api/users', routerUsers);
  // app.use('/api/users', routerUsers);
  app.use('/api/teams', routerTeams);
  app.use('/api/leagues', routerLeague);
  app.use('/api/matches', routerMatch);
  app.use('/api/user', routerUser);
  app.use('/api/division', routerDivision);

  app.use(errorHandler);

  // Listening
  console.log(process.env.HOST, process.env.PORT)
  const host = process.env.HOST || '127.0.0.1';
  const port = process.env.PORT || 8080;
  app.listen(port, host, () =>
    console.log(
      `[App] Server is listening on http://${host}:${port}\n` +
        '========================================================',
    ),
  );
};

main();
