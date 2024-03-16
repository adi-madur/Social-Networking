import express from'express';
import { followUser, unfollowUser, followDetails, userFeed } from '../controllers/followController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

let followRouter = express.Router();

followRouter.post('/followuser', jwtAuth, followUser);
followRouter.post('/unfollowuser', jwtAuth, unfollowUser);
followRouter.use('/followdetails', jwtAuth, followDetails);
followRouter.use('/userfeed', jwtAuth, userFeed);

export default followRouter;