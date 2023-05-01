import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);//Obtenemos el Feed de la Home
router.get("/:userId/posts", verifyToken, getUserPosts);//Obtenemos el Feed de dicho user

/* UPDATE */

//Dar Like/unLike
router.patch("/:id/like", verifyToken, likePost);

export default router;