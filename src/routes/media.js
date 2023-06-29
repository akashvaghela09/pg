const { Router } = require("express");
const router = Router();

const { getTitleDetails } = require("../controllers/media.controller");

router.get("/title/:id", getTitleDetails);

module.exports = router;

