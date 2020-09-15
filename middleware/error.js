const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = {...err};

  error.message = err.message
  //log for dev
  console.log(err)
  
  //Mongoose bad ObjectId
  if(err.name === 'CastError'){ // not format with objectID
    error = new ErrorResponse(`Resource not found with id of ${err.value}`, 404) 
  }

  //Mongoose duplicate key
  if(err.code === 11000){
    error = new ErrorResponse(`Duplicate filed value entered`, 404) 
  }
  
  //Mongoose validation error 
  if(err.name === 'ValidationError'){
    error = new ErrorResponse(Object.values(err.errors).map(val => val.message), 400) 
  }
  

	res
		.status(error.statusCode || 500)
		.json({ success: false, error: error.message || "Server Error" });
};

module.exports = errorHandler;
