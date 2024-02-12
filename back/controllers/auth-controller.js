const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const db = require("../models/db");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

exports.register = async (req, res, next) => {
  const {firstName, lastName, username, password, phone, email } = req.body;
  try {
    // validation
    if (!(firstName && lastName && username && password&&phone && email  )) {
      return next(new Error("Fulfill all inputs"));
    }
    
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);
    const data = {
      firstName,
      lastName,
      username,
      password : hashedPassword,
      phone,
      email
    };

    const rs = await db.user.create({ data  })
    console.log(rs)

    res.json({ msg: 'Register successful' })
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const {username, password} = req.body
  try {
    // validation
    if( !(username.trim() && password.trim()) ) {
      throw new Error('username or password must not blank')
    }
    // find username in db.user
    const user = await db.user.findFirstOrThrow({ where : { username }})
    // check password
    const pwOk = await bcrypt.compare(password, user.password)
    if(!pwOk) {
      throw new Error('invalid login')
    }
    // issue jwt token 
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })
    console.log(token)
    res.json({token : token})
  }catch(err) {
    next(err)
  }
};

exports.getme = (req,res,next) => {
  res.json(req.user)
}
