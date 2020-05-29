const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
    //res.send('Base auth route')
})


// @route POST api/auth
// @desc Login route
// @access Public    
router.post('/', [
    check('email').isEmail(),
    check('password').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors : errors.array() })
    }

    // Object destructuring 
    const { email, password } = req.body;

    try {
        // Await forces rest of the code to wait for the result of this function
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}] })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}] })
        }

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