const jsonServer = require('json-server');

const data = require('./api/db.js');
const routes = require('./src/config/server/router.json');

const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults({
  readOnly: true,
  noCors: true,
  static: './src/public/',
});

// github.com/typicode/json-server/issues/690#issuecomment-348616467
// json-server options.bodyParser defalut is true
// server.use(jsonServer.bodyParser);

server.use(middlewares);
server.use(jsonServer.rewriter(routes));
server.use(router);

// Avoid CORS issue
// json-server options.noCors defalut is false
// server.use( (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

server.listen(8000, () => {
  console.log('JSON Server is running, see http://localhost:8000');
});
