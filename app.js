if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const URI = process.env.URI;



const express = require("express");
const graphqlHTTP = require('express-graphql');

const app = express();
const cors = require('cors');

const mongoose = require('mongoose');
const schema = require('./schema/schema');



mongoose.connect(URI,
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
