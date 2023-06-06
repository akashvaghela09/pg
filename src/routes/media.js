const { Router } = require("express");
const router = Router();

const { getMediaDetails } = require("../controllers/media.controller");

router.get("/title", getMediaDetails);

module.exports = router;

