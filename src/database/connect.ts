import mongoose from 'mongoose';

async function connectDB(MONGO_URI: string) {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected To: ${MONGO_URI}`);
    } catch (err) {
        console.error(`Failed to connect to MongoDB: ${err}`);
        process.exit(1);
    }
}

export default {
    connectDB
};