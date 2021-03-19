const mogoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mogoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
});

userSchema.plugin(uniqueValidator);
module.exports = mogoose.model("User", userSchema);
