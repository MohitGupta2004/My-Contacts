const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST /api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const{username, email, password} = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const userAvailable = await User.findOne({email}) || await User.findOne({username});
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }
    
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log(user);
    //Check if user is created
    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
        });
    }
    else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//@desc Login a user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const user = await User.findOne({email});
    if (user && (await bcrypt.compare(password, user.password))) {
        const access_token = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15min"}
        );
        res.status(200).json({access_token});
    } 
    else {
        res.status(400);
        throw new Error("Invalid credentials");
    }
});

//@desc Get user data
//@route GET /api/users/profile 
//@access Private
const getUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getUser
}

