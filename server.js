const express = require('express');

const server = express();
const helmet = require('helmet');

const userRouter = require('./users/userRouter');

// server.get('/', (req, res) => {
//   res.send(`<h2>Let's write some middleware!</h2>`)
// });

//custom middleware

function logger(req, res, next) {
  console.log(`Information Logger: [${new Date().toISOString}] ${req.method} to ${req.url}`);

  next();
};

server.use(helmet());
server.use(userRouter);
server.use(logger);
server.use(express.json())


module.exports = server;
