const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')
const generateToken = (id) => {
  return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn:'30d'} )
}

// Register a new user
const registerUser = async(req,res) => {
  const {name , email , password} = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
      const otp = Math.floor(1000000 + Math.random() * 900000).toString();
      const message = `
      Welcome to ShopNet, ${name}!
      Your OTP for ShopNet registration is: ${otp}`;

      await sendEmail(
        email,
        "Welcome to ShopNet- Your Otp for registration ",
        message,
      );
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
// Login user 
const  loginUser = async(req ,res) => {

  const {email , password} = req.body;
  try {
    const user = await User.findOne({ email });
    if(user && (await bcrypt.compare(password , user.password))) 
    {
      res.json({
        _id : user._id ,
        name : user.name ,
        email : user.email ,
        role : user.role ,
        token : generateToken(user._id)
      })
    }
    else {
      res.status(400).json({ message : "Invalid email or password"})
    }
  }
  catch(error) 
  {
    res.status(500).json({ message : 'Server error'});
  }


}

// Get User
const getUser = async(req,res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  }
  catch(error) 
  {
    res.status(500).json({message : 'Server error'})
  }
}

module.exports = { registerUser, loginUser, getUser };