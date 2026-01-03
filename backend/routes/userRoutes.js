import express from "express";
import { signupUser } from "../controller/userController.js";

const router = express.Router();

// POST /api/users/signup
router.post("/signup", signupUser);

export default router;
