import express from "express";
import { login, signUp, validate_role, logout, confirmEmail, forgotPassword, resetPassword } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/validate_role", validate_role);
router.get("/confirmEmail", confirmEmail);
router.post("/forgotpassword", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;