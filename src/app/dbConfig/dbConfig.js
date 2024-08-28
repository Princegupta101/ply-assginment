import mongoose from "mongoose";

export async function connect() {
    try {
        const uri = process.env.MONGO_URL;
        if (!uri) {
            throw new Error('MONGO_URL environment variable is not defined');
        }
        
        await mongoose.connect(uri);

        mongoose.connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        // Optionally, handle the error or rethrow it
    }
}
