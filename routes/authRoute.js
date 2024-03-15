import express from'express';
import { signup, signin, getUser, logout, updateUser } from '../controllers/authController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/user', jwtAuth, getUser);
authRouter.get('/logout', jwtAuth, logout);
authRouter.post('/updateuser', jwtAuth, updateUser);

export default authRouter;