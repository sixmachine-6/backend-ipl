const AppError = require("./../utils/appError");
const handleDuplicateFieldsDB = (err) => {
  console.log(err);
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // let error = { ...err };
  // console.log(error);
  // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  // console.log("amns", error.status, error.message);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
