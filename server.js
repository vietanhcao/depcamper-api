const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db.js');
const colors = require('colors')
const errorHandler = require('./middleware/error.js');

//load env file
dotenv.config({ path: './config/config.env'});

//Connect to database
connectDB()


// Route files

const bootcamps = require('./router/bootcamp.js');

const app = express();

//Body parser
app.use(express.json())


//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}


//Mount routers
app.use('/api/v1/bootcamps', bootcamps);



app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`.yellow.bold));


//Handle unhandled promise rejection
process.on('unhandledRejection',(error, promise) => {
  console.log(`error ${error.message}`.red)
  // Close server & exit process
  server.close(() => process.exit(1))
})