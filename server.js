const express = require('express');
const expressGraphQL = require('express-graphql');
const bodyParser = require('body-parser');

const schema = require('./schema/schema.js');
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT;
const app = express();

app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true
  })
);

app.listen(port, () => console.log(`Server on Port:${port}`));
