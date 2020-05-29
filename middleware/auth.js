const jwt = require('jsonwebtoken')
const config = require('config')

// Get current JWT, send it back and verify 
// We use this for certain routes that are protected and require the user to be authenticated in order to gain access

module.exports = function(req, res, next) {
    // Get token from header
    // Check if there's no token
    // Verify token

    const token = req.header('x-auth-token')

    if(!token) {
        return res.status(401).json({ msg : 'No token, access denied' })
    }

    try {
        // Decode token 
        const decoded = jwt.verify(token, config.get('jwtSecret'))

        req.user = decoded.user
        next();
    } catch(err) {
        console.error(err.message)
        return res.status(401).json({ msg : 'Auth token is not valid' })
    }
}