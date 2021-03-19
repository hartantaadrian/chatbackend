const User = require("../models/user");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signIn = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Cannot signup right now", 500));
  }
  if (existingUser) {
    return next(
      new HttpError("Cannot create the users, email has been used", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    new HttpError("Cannot create user, something went wrong", 500);
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Could not Signup", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email, name: newUser.name },
      "secretttt",
      {
        expiresIn: "1h",
      }
    );
    console.log(token);
  } catch {
    return next(new HttpError("Could not Signup", 500));
  }

  res.status(200).json({ token: token });
};
const login = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(email, password);
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Cannot login right now", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Wrong username or password", 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong", 500));
  }

  console.log(isValidPassword);
  if (isValidPassword === false) {
    console.log("masuk isini");
    return next(new HttpError("Wrong username or password", 401));
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
      "powerrr",
      {
        expiresIn: "1h",
      }
    );
  } catch {
    return next(new HttpError("Could not login", 500));
  }

  res.status(200).json({
    token: token,
  });
};

exports.login = login;
exports.signIn = signIn;
