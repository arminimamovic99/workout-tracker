const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Workout = require('../../models/Workout.js')
// @route   GET api/workout
// @desc    Get all workouts
// @access  Public
router.get('/', (req, res) => {
    res.end('Workouts')
})

// @route   POST api/workout
// @desc    Create a workout
// @access  Public
router.post('/', auth, async (req, res) => {
    const { type, duration, date } = req.body
    try {
        let user = req.user.id
        let workout = new Workout({
            user,
            type,
            duration,
            date
        })

        await workout.save()

        res.json(workout)
    } catch (error) {
        console.error(error)
        return res.status(500).send('Server error')
    }
})

// @route    DELETE api/workout
// @desc     Delete workout
// @access   Private
router.delete('/:id', auth, async (req, res) => {
    try {
      // Remove profile
      await Workout.findOneAndRemove({ user : req.params.id })

      res.json({ msg : 'Workout deleted' })

    } catch(err) { 
      console.error(err.msg)
      res.status(500).send('Server Error')
    }
})
module.exports = router;