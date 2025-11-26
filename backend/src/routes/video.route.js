import { Router } from "express";
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    incrementViewCount,
    getChannelVideos,
} from "../controllers/video.controller.js";

import { verifyJwt as verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getSignature } from "../controllers/signVideoUpload.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/get-signature", getSignature);

router.patch("/incrementViewsCount/:videoId", incrementViewCount);

router.patch("/toggle/publish/:videoId", togglePublishStatus);

router.get("/c/:channelId", getChannelVideos);

router
    .route("/")
    .get(getAllVideos)
    .post(upload.single("thumbnail"), publishAVideo);

router
    .route("/:videoId/:channelId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

export default router;
