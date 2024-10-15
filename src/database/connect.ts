import mongoose from 'mongoose';
import logger from "../utils/logger";

async function connectDB(MONGO_URI: string) {
    try {
        await mongoose.connect(MONGO_URI);
        logger.database(`MongoDB Connected To: ${MONGO_URI}`);
    } catch (err) {
        console.error(`Failed to connect to MongoDB: ${err}`);
        process.exit(1);
    }
}

export default {
    connectDB
};