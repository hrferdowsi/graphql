if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


const IEnvs= {
  URI: process.env['URI'],
  SQL_USERNAME: process.env['SQL_USERNAME'],
  SQL_PASSWORD: process.env['SQL_PASSWORD'],
  SQL_SERVER: process.env['SQL_SERVER'],
  SQL_DB: process.env['SQL_DB']
} 


const mongoose = require('mongoose');
const schema = require('./schema/schema');

const express = require("express");
const graphqlHTTP = require('express-graphql');

const app = express();
const cors = require('cors');

// SQL tedious:
const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
  server: IEnvs.SQL_SERVER, // update me
  authentication: {
    type: 'default',
    options: {
      userName: IEnvs.SQL_USERNAME, // update me
      password: IEnvs.SQL_PASSWORD // update me
    },
    type: "default"
  },
  options: {
    database: IEnvs.SQL_DB, //update me
    trustServerCertificate: true,
    encrypt: true
  }
};


// //tesing SQL query
  const sqlConnection = new Connection(config);
  sqlConnection.connect()
  sqlConnection.on("connect", err => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("SQL is connected")
      queryDatabase();
    }
  });



function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request = new Request(
    `SELECT TOP 20 pc.Name as CategoryName,
                   p.name as ProductName
     FROM [SalesLT].[ProductCategory] pc
     JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );
  request.on("row", columns => {

    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
    });
  });

  sqlConnection.execSql(request);
}

///

// Mongoose


mongoose.connect(
  IEnvs.URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);


// const User = require('./mongoose_model/user');

mongoose.connection.once('open', () => {
  console.log("mongoose is connected");
  // console.log(User.findById("5f9bfe54c0fd1d0da4bae587"));
})

app.use(cors());


app.use('/',
  graphqlHTTP({
    graphiql: true,
    schema
  })
)


app.listen(process.env.PORT || 4000, () => { //localhost: 4000
  console.log("listening for Request on port 4000");
  console.log("http://localhost:4000/");
});
