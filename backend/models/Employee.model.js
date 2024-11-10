import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';
const AutoIncrement = AutoIncrementFactory(mongoose.connection);
const employeeSchema = new mongoose.Schema({
    f_id: {
        type: Number,
        unique: true

    },
    f_Image: {
        type: String,
        required: false
    },
    f_Name: {
        type: String,
        required: true
    },
    f_Email: {
        type: String,
        required: true,
        unique: true
    },
    f_Mobile: {
        type: String,
        required: true
    },
    f_Designation: {
        type: String,
        required: true,

    },
    f_Gender: {
        type: String,
        enum: ['male', 'female', 'other'],

    },
    f_Course: {
        type: String,

        required: true
    },

}, {
    timestamps: true
});
employeeSchema.plugin(AutoIncrement, { inc_field: 'f_id' });
const Employee = mongoose.model('t_Employee', employeeSchema);

export default Employee;
