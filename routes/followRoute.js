import express from'express';
import { followUser, unfollowUser } from '../controllers/followController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

const followRouter = express.Router();

followRouter.post('/followuser', jwtAuth, followUser);
followRouter.post('/unfollowuser', jwtAuth, unfollowUser);

export default followRouter;