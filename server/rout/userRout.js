import express from "express"
import { getAlUsers } from "../routControler/userControler.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.get('/', isLogin, getAlUsers)

// router.search('/search',)

// router.post('/id',)


export default router