import { Router } from "express";
import { registerUser, userLogin } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()


router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),registerUser)

router.route("/login").post(upload.none(),userLogin)


export default router;