const { Router } = require("express");
const router = Router();

const { getTitleDetails } = require("../controllers/media.controller");

router.get("/title", getTitleDetails);

module.exports = router;

