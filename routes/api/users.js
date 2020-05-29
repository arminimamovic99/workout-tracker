const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User.js')

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/', (req, res) => {
    res.send('Base user route')
})

// @route POST api/users
// @desc Register User
// @access Public
router.post('/register', 
    [
        check('name').not().isEmpty(),
        check('email').not().isEmpty(),
        check('password').not().isEmpty()
    ], 
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors : errors.array() })
        }

        // Object destructuring 
        const { name, email, password, fieldOfWork } = req.body;

        try {
            // Await forces rest of the code to wait for the result of this function
            let user = await User.findOne({ email })

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists'}] })
            }

            // Get user gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                password,
                avatar
            });
            
            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt)

            await user.save();

            // Payload is the actual data we want to send to client side
            const payload = {
                user : {
                    id : user.id
                }
            }

            // TODO change expiresIn to 3600 before deploying to production
            jwt.sign(payload, config.get('jwtSecret'), { expiresIn : 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });


        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
})

module.exports = router;