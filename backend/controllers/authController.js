const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

exports.getAllUsers = async (req, res) => {
    const users = await User.find()

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  };

exports.signup = async(req, res, next) => {
    try {
        // console.log(req.body)
        const newUser = await User.create(req.body);

        const token = signToken(newUser._id)

        res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    // check email
    // console.log(email, password)
    if(!email || !password) {
        return next(new Error('Please provide email and password'), 400)
    }

    // check the user
    const user = await User.findOne({email}).select('+password');
    console.log(user)
    
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next( new Error('Please provide email and password'), 401)
    }//  else(console.log('User exists and passswords are matching'))

    // everything ok
    const token = signToken(user._id);
    console.log(token)
    res.status(200).json({
        status: 'success',
        token,
        user
    })
}