import { Router } from "express";
import {
  signUpUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  logoutUser,
} from "./userController";

const router = Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/me", getCurrentUser);
router.put("/profile", updateUserProfile);
router.post("/logout", logoutUser);

export default router;