import express from'express';
import { signup, signin, getUser, logout, updateUser, deleteUser } from '../controllers/authController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

let authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/user', jwtAuth, getUser);
authRouter.get('/logout', jwtAuth, logout);
authRouter.post('/updateuser', jwtAuth, updateUser);
authRouter.get('/deleteuser', jwtAuth, deleteUser);

export default authRouter;