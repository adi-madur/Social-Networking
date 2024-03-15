import express from'express';
import { followUser, unfollowUser, followDetails } from '../controllers/followController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

const followRouter = express.Router();

followRouter.post('/followuser', jwtAuth, followUser);
followRouter.post('/unfollowuser', jwtAuth, unfollowUser);
followRouter.use('/followdetails', jwtAuth, followDetails);

export default followRouter;