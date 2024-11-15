import user from "../models/user.model.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Employee from "../models/Employee.model.js";
import { v2 as cloudinary } from 'cloudinary'
export const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

export const employeeDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id)
        if (!employee) {
            return res.json({ message: 'Employee not found', success: false })
        }
        res.json({ message: "Employee found", success: true, employee })
    } catch (error) {
        console.log(error)
        return res.json({ message: 'Server Error', success: false })

    }
}



export const adminSignup = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        if (!email && !password && !username) {
            return res.json({ message: 'All fields are required', success: false })
        }
        const existingUser = await user.findOne({ f_Email: email })
        if (existingUser) {
            return res.json({ message: 'Email already exists', success: false })
        }
        if (!validator.isEmail(email)) {
            res.json({ message: 'Invalid Email', success: false })
        }
        if (email.length > 30 && email.length < 5) {
            res.json({
                success: false,
                message: "Email length exceeds  the limit"
            })
        }
        if (password.length < 5) {
            return res.json({
                success: false,
                message: "Password must be at least 5 characters long"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new user({
            f_UserName: username,
            f_Email: email,
            f_Pwd: hashedPassword
        })

        const token = createToken(newUser._id)
        await newUser.save()
        res.json({
            success: true,
            token,
            newUser,
            message: 'User registered successfully'
        })
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server Error', success: false })

    }
}
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({ message: 'All fields are required', success: false });
        }

        const existingUser = await user.findOne({ f_Email: email });
        if (!existingUser) {
            return res.json({ message: 'User not found', success: false });
        }

        const isMatched = await bcrypt.compare(password, existingUser.f_Pwd);
        if (!isMatched) {
            return res.json({ message: 'Invalid password', success: false }); // 401 for invalid credentials
        }

        // Proceed to generate token and send successful login response
        const token = createToken(existingUser._id); // Assuming generateToken is a function that creates a token
        res.json({ token, existingUser, success: true });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error. Please try again later.', success: false });
    }
};

export const createEmployee = async (req, res) => {

    const { email, phone, designation, gender, course, name } = req.body;

    try {
        if (!email || !phone || !designation || !gender || !course || !name) {
            return res.json({ message: 'All fields are required', success: false })
        }


        let imageUrl = null;
        if (!req.files.image) {
            return res.json({ message: 'Please upload an image', success: false })
        }
        const image = req.files.image && req.files.image[0];
        const existingEmployee = await Employee.findOne({ f_Email: email })
        const existingEmployee2 = await Employee.findOne({ f_Mobile: phone })
        if (existingEmployee2) {
            return res.json({ message: 'Phone number  already exists', success: false })
        }
        if (existingEmployee) {
            return res.json({ message: 'Email already exists', success: false })
        }

        if (image) {
            let result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' })
            imageUrl = result.secure_url;
        }
        const newEmployee = new Employee({
            f_Image: imageUrl,
            f_Name: name,
            f_Email: email,
            f_Mobile: phone,
            f_Designation: designation,
            f_Gender: gender,
            f_Course: course
        })


        await newEmployee.save()
        res.json({ message: 'Employee created Successfully', success: true, newEmployee })
    } catch (error) {
        console.log(error);
        if (error.message.includes("validation failed")) {
            return res.json({ message: 'Validation error in input fields', success: false });
        }
        if (error.code === 'ENOTFOUND') { // Handling specific server errors
            return res.json({ message: 'External service unavailable', success: false });
        }

        return res.json({ message: 'Server error', success: false });

    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.json({ message: 'Employee not found', success: false });
        }
        res.json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server Error', success: false });

    }
}
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params
        const { designation, name, email, phone, gender, course } = req.body

        const updatedData = {

        }
        if (designation) updatedData.f_Designation = designation
        if (name) updatedData.f_Name = name
        if (email) updatedData.f_Email = email
        if (phone) updatedData.f_Mobile = phone
        if (gender) updatedData.f_Gender = gender
        if (course) updatedData.f_Course = course


        const Existingemployee = await Employee.findById(id)

        if (req.files && req.files.image && req.files.image[0]) {
            if (Existingemployee.f_Image) {
                const oldImage = Existingemployee.f_Image.split('/').pop().split('.')[0]
                await cloudinary.uploader.destroy(oldImage)
            }
            const image = req.files.image[0];
            const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
            updatedData.f_Image = result.secure_url;


        }
        const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });

        res.json({ success: true, message: 'Employee updated successfully', updatedEmployee })
    } catch (error) {
        console.log(error);
        const errorMessage = error.name === 'ValidationError' ? error.message : 'Server Error';
        return res.json({ message: errorMessage, success: false });

    }
}


export const getEmployees = async (req, res) => {
    try {
        const employee = await Employee.find({})
        res.json({ success: true, employee });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server Error', success: false });

    }
}
export const getAdminDetails = async (req, res) => {
    try {
        const { id } = req.user.id;
        const admin = await user.findById(id)
        res.json({ success: true, admin });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server Error', success: false })

    }
}


export const paginatedEmployee = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const employees = await Employee.find({})

        const startIndex = (page - 1) * limit
        const lastIndex = (page) * limit

        const results = {}
        results.totalEmployee = employees.length
        results.totalUsers = employees.length
        results.pageCount = Math.ceil(employees.length / limit)

        if (lastIndex < employees.length) {
            results.next = {
                page: page + 1,
                limit
            }
        }
        if (startIndex > 0) {
            results.prev = {
                page: page - 1,
                limit
            }
        }




        results.result = employees.slice(startIndex, lastIndex)
        res.json({ results, success: true })
    } catch (error) {
        console.log(error);
        res.json({
            message: 'Server Error',
            success: false
        })

    }
}