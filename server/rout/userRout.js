import express from "express"
import { getAlUsers, getUserByUsernameOrEmail, getUserById } from "../routControler/userControler.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.get('/', isLogin, getAlUsers)

router.search('/search', getUserByUsernameOrEmail)

router.post('/:id', getUserById)


export default router;