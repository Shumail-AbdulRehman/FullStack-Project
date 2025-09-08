import { Router } from "express";
import { registerUser, userLogin ,userLogOut} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

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

router.route("/logout").post(verifyJwt,userLogOut)

export default router;