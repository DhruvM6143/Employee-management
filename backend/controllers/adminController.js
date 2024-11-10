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
            return res.status(400).json({ message: 'Employee not found', success: false })
        }
        res.status(200).json({ message: "Employee found", success: true, employee })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server Error', success: false })

    }
}



export const adminSignup = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        if (!email && !password && !username) {
            return res.status(400).json({ message: 'All fields are required', success: false })
        }
        const existingUser = await user.findOne({ f_Email: email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists', success: false })
        }
        if (!validator.isEmail(email)) {
            res.status(400).json({ message: 'Invalid Email', success: false })
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
        res.status(200).json({
            success: true,
            token,
            newUser,
            message: 'User registered successfully'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error', success: false })

    }
}
export const adminLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required', success: false })
        }
        const existingUser = await user.findOne({ f_Email: email })
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found', success: false })
        }
        const isMatched = await bcrypt.compare(password, existingUser.f_Pwd)
        if (!isMatched) {
            return res.status(404).json({ message: 'Invalid password', success: false })
        }

        const token = createToken(existingUser._id)
        return res.status(200).json({
            success: true,
            token,
            existingUser,
            message: 'User logged in successfully'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error', success: false })


    }

}
export const createEmployee = async (req, res) => {

    const { email, phone, designation, gender, course, name } = req.body;

    try {
        if (!email || !phone || !designation || !gender || !course || !name) {
            return res.status(400).json({ message: 'All fields are required', success: false })
        }


        let imageUrl = null;
        const image = req.files.image && req.files.image[0];
        const existingEmployee = await Employee.findOne({ f_Email: email })
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email already exists', success: false })
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
        res.status(200).json({ message: 'Employee created Successfully', success: true, newEmployee })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error', success: false })
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found', success: false });
        }
        res.json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error', success: false });

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
        return res.status(500).json({ message: errorMessage, success: false });

    }
}


export const getEmployees = async (req, res) => {
    try {
        const employee = await Employee.find({})
        res.json({ success: true, employee });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error', success: false });

    }
}
export const getAdminDetails = async (req, res) => {
    try {
        const { id } = req.user.id;
        const admin = await user.findById(id)
        res.json({ success: true, admin });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error', success: false })

    }
}
