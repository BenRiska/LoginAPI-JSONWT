const router = require('express').Router();
const userModel = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');



// register
router.post('/register', async (req, res) => {
    // lets validate the data before making a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user is already in database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const user = new user({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,

    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }

});


//login
router.post('/login', async (req, res) => {
    //lets validate the data first
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user is in database
    const emailExist = await User.findOne({ email: req.body.email });
    if (!emailExist) return res.status(400).send('Email doesn\'t exist. Please try again.');

    // check password 
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid Password');

    //create and assign web token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    res.send('Logged in');

});


module.exports = router;