import express from 'express';
import connectToDb from './config/db.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import authRouter from './routes/authRoute.js';
import postRouter from './routes/postRoute.js';
import followRouter from './routes/followRoute.js';

const app = express(); 
connectToDb();

// Middlewares
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth/', authRouter);
app.use('/api/post/', postRouter);
app.use('/api/follow/', followRouter);

app.use('/', (req, res)=>{
    res.status(200).json({
        msg:"Server is running...",
    })
})

export default app;