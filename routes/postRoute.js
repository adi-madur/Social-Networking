import express from'express';
import { createPost, deletePost, viewPost, updatePost } from '../controllers/postController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

let postRouter = express.Router();

postRouter.use("/createpost", jwtAuth, createPost);
postRouter.use("/viewpost", jwtAuth, viewPost);
postRouter.use('/deletepost', jwtAuth, deletePost);
postRouter.use('/updatepost', jwtAuth, updatePost);

export default postRouter;