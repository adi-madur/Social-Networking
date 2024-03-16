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

app.use('/', (req, res) => {
    res.status(200).json({
        msg: "Server is running...",
    })
})

// -------------- RATE LIMITING ------------------------
import rateLimit from 'express-rate-limit';

// Create a rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply the rate limiter to all requests
app.use(limiter);
// -------------- END OF RATE LIMITING -------------------
export default app;