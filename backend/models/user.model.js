import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';


const AutoIncrement = AutoIncrementFactory(mongoose.connection);

const userSchema = new mongoose.Schema({
    f_sno: {
        type: Number,
        unique: true
    },
    f_UserName: {
        type: String,
        required: true
    },
    f_Email: {
        type: String,
        required: true
    },
    f_Pwd: {
        type: String,
        required: true
    }
});

// auto-increment plugin to the `f_sno` field
userSchema.plugin(AutoIncrement, { inc_field: 'f_sno' });


const user = mongoose.model('t_login', userSchema);

export default user;
