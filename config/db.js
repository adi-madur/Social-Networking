import mongoose from 'mongoose';

const connectToDb = async () => {
    URL = process.env.MONGO_URL;
    try {
        mongoose.connect(URL)
        .then((conn)=>{
            console.log(`Connected to database: ${conn.connection.host}`);
        })
    } catch (e) {
        console.log(e.message);
    }
}

export default connectToDb;