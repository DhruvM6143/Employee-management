import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/EmployeeAdmin`)
        console.log(`Mongoose Connected to ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);

    }

}