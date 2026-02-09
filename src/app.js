const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const startDb = require('./configs/dbconnect.js');
const authRoutes = require('./routes/authroutes.js');

startDb();






const app = express()

//middlewares
app.use(bodyParser.json());

app.use("/api/auth", authRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`)
 });

app.get('/health', (req, res) => {
  res.status(200).send({
    message: 'Church Management System API',
    version: '1.0.0',
    status: 'running'
  });
});

//MongoDb
// mongoose.connect(`${process.env.CONNECTION_STRING}`).then((e)=>{
// console.log('You don connect plug');

// //start app if sucessful

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on http://localhost:${process.env.PORT}`)
// })


// }).catch((err)=>{
//   console.log(`connection no work ooo ${err}`)
// });




