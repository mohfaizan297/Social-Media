const express = require('express')
const dotenv = require('dotenv')
const dbConnect = require('./dbConnect')
const authRouter = require('./router/authRouter')
const postsRouter = require('./router/postsRouter')
const userRouter = require('./router/userRouter')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const cloudinary = require('cloudinary').v2


dotenv.config('./.env')

// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const app = express();


//Middlewares
app.use(express.json({limit: '10mb'}))
app.use(morgan('common'))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))


app.use('/auth', authRouter)
app.use('/posts', postsRouter)
app.use('/user', userRouter)

dbConnect();
const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log('Listening of port', PORT)
})