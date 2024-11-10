import express from 'express'
import { createEmployee, deleteEmployee, employeeDetail, getEmployees, paginatedEmployee, updateEmployee } from '../controllers/adminController.js'
import upload from '../middleware/multer.js'
import authUser from '../middleware/admin.middleware.js'
const employeeRoute = express.Router()

employeeRoute.post('/create-employee', upload.fields([{ name: 'image', maxcount: 1 }]), authUser, createEmployee)
employeeRoute.delete('/delete-employee/:id', authUser, deleteEmployee)
employeeRoute.post('/update-employee/:id', upload.fields([{ name: 'image', maxCount: 1 }]), authUser, updateEmployee)
employeeRoute.get('/list-employees', authUser, getEmployees)
employeeRoute.get('/employee/:id', authUser, employeeDetail)
employeeRoute.get('/paginatedusers', paginatedEmployee)

export default employeeRoute;