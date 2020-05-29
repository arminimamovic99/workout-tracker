const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const request = require('request');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    POST api/profile/create
// @desc     Create/update a profile
// @access   Private
router.post('/create', [ auth, [
  check('status').not().isEmpty(),
  check('skills').not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(400).json({ errors : errors.array()})
    }

    const {
      location,
      website,
      bio,
      youtube,
      twitter,
      instagram,
      facebook,
      sports
    } = req.body;

    let profileFields = {}
    profileFields.user = req.user.id
    if(location) profileFields.location = location
    if(website) profileFields.website = website
    if(bio) profileFields.bio = bio
    if(status) profileFields.status = status
    if(sports) {
      profileFields.sports = skills.split(',').map(sport => sport.trim())
    }

    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube    
    if (twitter) profileFields.social.twitter = twitter 
    if (facebook) profileFields.social.facebook = facebook 
    if (instagram) profileFields.social.instagram = instagram

    try {
      let profile = await Profile.findOne({ user : req.user.id })

      if (profile) {
        profile = await Profile.findOneAndUpdate({ user : req.user.id }, { $set : profileFields }, { new : true })  
        return res.json(profile)
      }

      profile = new Profile(profileFields)

      await profile.save()
      res.json(profile)

    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
    
})

// @route    GET api/profile/
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {

    const profiles = await Profile.find().populate('user', [
      'name',
      'avatar',
      'fieldOfWork'
    ]) 
    res.json(profiles)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server')
  }
})

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user id
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user : req.params.user_id }).populate('user', ['name', 'avatar', 'fieldOfWork'])

    if(!profile) {
      res.status(400).send({ msg : 'No profile found for this user'})
    }

    res.json(profile)

  } catch (err) {
    console.error(err.message)
    if (err.kind == 'ObjectId') {
      res.status(400).send({ msg : 'No profile found for this user'})
    }
    res.status(500).send('Server')
  }
})

// @route    DELETE api/profile
// @desc     Delete user and profile
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {
      // Remove profile
      await Profile.findOneAndRemove({ user : req.user.id })
      // Remove user
      await User.findOneAndRemove({ _id : req.user.id })

      res.json({ msg : 'User deleted' })

    } catch(err) { 
      console.error(err.msg)
      res.status(500).send('Server Error')
    }
})



module.exports = router;