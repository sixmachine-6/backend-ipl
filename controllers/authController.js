const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const assignTeamRandomly = require("./../utils/helper");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    iplTeam: await assignTeamRandomly(),
  });
  const populatedUser = await newUser.populate("iplTeam");
  createSendToken(populatedUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const populatedUser = await user.populate("iplTeam");
  createSendToken(populatedUser, 200, res);
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in to get access", 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    let user = await User.findById({ _id: decoded.id });
    user = await user.populate("iplTeam");
    if (!user) return next("user does not exist with these token");
    req.user = user;
    return next();
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      err: err.message,
    });
    return next();
  }
  next();
};

exports.getUser = async (req, res, next) => {
  try {
    if (!req.user) return next(new AppError("User does not exist", 401));
    console.log("requser", req.user);
    res.status(200).json({
      status: "success",
      role: "authenticated",
      data: {
        authenticatedUser: req.user,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
