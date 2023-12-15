const mongoose = require('mongoose');
const validator =  require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name parameter is mandatory"]
  },
  email: {
    type: String,
    required: [true, "Email parameter is mandatory"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, "Password parameter is mandatory"],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password(node says)"],
    validate: {
      validator: function (el) {
        return el === this.password; // Compare with the 'password' field
      },
      message: "Passwords don't match!",
    },

  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  winLossRatio: {
    type: Number,
    default: 0 
  }
});


userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model('User', userSchema);
