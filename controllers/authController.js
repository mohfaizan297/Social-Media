const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { error, success } = require('../utils/responseWrapper');


const signupController = async (req, res) => {
    try {
        const {name,email, password} = req.body;
        if(!email || !password || !name){
            return res.send(error(400, 'Email and Password are required'))
        }
        const oldUser = await User.findOne({email})
        if(oldUser)
        {
            return res.send(error(400, 'User is already Registered'))
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashPassword
        })
        return res.send(success(201, "User Created Successfully"))

    } catch (e) {
        return res.send(error(500, e.message))
    }
}
const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.send(error(400, 'Email and Password are required'))
        }
        const user = await User.findOne({email}).select('+password')
        if(!user){
            return res.send(error(404, 'User is not registered'))
        }
        const matched = await bcrypt.compare(password, user.password)
        if(!matched)
        {
            return res.send(error(403, 'Password is Incorrect'))
        }
        const accessToken = generateAccessToken({_id: user._id})
        const refreshToken = generateRefreshToken({_id: user._id})
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })
        return res.send(success(200, {accessToken}))

    } catch (e) {
        return res.send(error(500, e.message))
    }
}
const refreshAccessTokenController = async (req, res) => {
    
    const cookies = req.cookies;
    if(!cookies.jwt)
    {
        return res.send(error(401, 'refresh token in cookie is required'))
    }
    const refreshToken = cookies.jwt;
    try {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY)
        const _id = decode._id;
        const accessToken = generateAccessToken({_id})
        return res.send(success(201, {accessToken}))
    } catch (e) {
        console.log(e)
        return res.send(error(401, 'Invalid refresh token'))
    }
}

const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        })
        return res.send(success(200, 'User logged out'))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}

function generateAccessToken (data){
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {expiresIn: '30d'})
        return token;
    } catch (e) {
        return res.send(error(500, e.message))
    }
}
function generateRefreshToken (data){
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {expiresIn: '1y'})
        return token;
    } catch (e) {
        return res.send(error(500, e.message))
    }   
}

module.exports = {signupController, 
    loginController, 
    refreshAccessTokenController,
    logoutController

}