import { Router } from "express";
import { generateNewAccessToken, getCurrentUser, registerUser, updateAvatar, updateCoverImage, updateUserEmailAndFullName, userLogin ,userLogOut} from "../controllers/user.controller.js";
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

router.route("/refreshtoken").post(generateNewAccessToken)

router.route("/get-current-user").get(verifyJwt,getCurrentUser)

// router.route("/update-fullname-and-email").patch(verifyJwt,updateUserEmailAndFullName)

// router.route("/update-avatar").patch(verifyJwt,updateAvatar)

// router.route("/update-cover-image").patch(verifyJwt,updateCoverImage)
export default router;