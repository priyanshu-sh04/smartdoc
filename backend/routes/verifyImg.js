import { Router } from "express";
import { verifyDocImg } from "../controllers/verifyDocImage.js";
import multer from "multer";
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG and PNG files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});
const router = Router();
router.post("/verifyImg", upload.single("document"), verifyDocImg);
export default router;
