import express from 'express'
import { adminLogin, adminSignup, createEmployee, deleteEmployee, getAdminDetails, getEmployees, updateEmployee } from '../controllers/adminController.js';
import authuser from '../middleware/admin.middleware.js'
const route = express.Router()

route.post('/signup', adminSignup)
route.post('/login', adminLogin)

route.get('/get-admin', authuser, getAdminDetails)
// route.post('/signup',)

export default route; 