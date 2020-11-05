if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const DATA_BASE = process.env.DATA_BASE;



const express = require("express");
const graphqlHTTP = require('express-graphql');

const app = express();
const cors = require('cors');

const mongoose = require('mongoose');
const schema = require('./schema/schema');



const url = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.ae11y.mongodb.net/${DATA_BASE}?retryWrites=true&w=majority`;

mongoose.connect(url,
  { useNewUrlParser: true, useUnifiedTopology: true });



mongoose.connection.once('open', () => {
  console.log("mongoose is connected")
})

app.use(cors());


app.use('/', graphqlHTTP({
  graphiql: true,
  schema
}))


app.listen(process.env.PORT || 4000, () => { //localhost: 4000
  console.log("listening for Request on port 4000");
  console.log("http://localhost:4000/");
});
