import express from "express";
import { sendBusinessInfo } from "../controllers/embedded-signup";

const router = express.Router();

// POST business info: exchange code + phone_number_id + waba_id
router.post("/business-info", sendBusinessInfo);

export default router;
