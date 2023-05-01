import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ: Rutas que sólo leen la DB, no hacen modificaciones */

// "users/id" --> nos devuelve el user con ese id
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);//nos devuelve los amigos del user

/* UPDATE */

//Con esta ruta, añadimos/eliminamos al amigo
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;