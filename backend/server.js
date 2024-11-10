import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDb } from './config/db.js';
import route from './routes/adminRoute.js';
import employeeRoute from './routes/employeeRoute.js';
import connectCloudinary from './config/cloudinary.js';
const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000;

connectDb().then(() => {
    console.log('Database connected successfully')
}).catch(err => console.log(err)
)
app.use(express.json())
app.use(cors())
connectCloudinary()
//admin route
app.use('/api/admin', route)

// employee route
app.use('/api/employee', employeeRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})