import { Router } from "express";
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js";

import { verifyJwt as verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT);

router.route("/:channelId").post(createTweet);
router.route("/user/:channelId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;
