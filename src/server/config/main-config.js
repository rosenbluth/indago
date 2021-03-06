// SET SESSION SECRET
// bash -c 'echo "SESSION_SECRET="$(openssl rand -hex 64)' >> .env

(function(appConfig) {

  'use strict';

  // *** main dependencies *** //
  const path = require('path');
  const bodyParser = require('body-parser');
  const session = require('cookie-session');
  const flash = require('connect-flash');
  const morgan = require('morgan');
  const nunjucks = require('nunjucks');
  const helmet = require('helmet');

  // *** view folders *** //
  const viewFolders = [
    path.join(__dirname, '..', 'views')
  ];

  // *** load environment variables *** //

  appConfig.init = function(app, express) {

    // *** view engine *** //
    nunjucks.configure(viewFolders, {
      express: app,
      autoescape: true
    });

    // *** load environment variables *** //
    require('dotenv').config();

    app.set('view engine', 'html');
    // app.set('view engine', 'ejs');

    // *** load helmet and cookie-session *** //
    // express security best practices to use helmet
    // https://expressjs.com/en/advanced/best-practice-security.html
    app.use(helmet());

    if(!process.env.SESSION_SECRET){
      process.env.SESSION_SECRET = '59494a82c746f1a9e5614a94e95a578f';
      console.warn('!!!SERVER IS NOT SECURE - NO ENV SESSION_SECRET PROVIDED!!!');
    }
    // cookie-session
    app.use(session({
      name: 'session',
      secret: process.env.SESSION_SECRET
    }));

    // This allows you to set req.session.maxAge to let certain sessions
    // have a different value than the default.
    app.use((req, res, next) => {
      req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge;
      next();
    });

    // *** app middleware *** //
    if (process.env.NODE_ENV !== 'test') {
      app.use(morgan('dev'));
    }
    // app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(flash());
    app.use(express.static(path.join(__dirname, '..', '..', 'client')));

  };

})(module.exports);
