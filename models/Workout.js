const mongoose = require('mongoose')

const WorkoutSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    type : {
        type : String,
    },
    description : {
        type : String
    },
    duration : {
        type : String
    },
    date : {
        type : Date,
        default : Date.now
    }
})

module.exports = Workout = mongoose.model('workout', WorkoutSchema)