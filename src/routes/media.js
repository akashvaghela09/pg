const { Router } = require("express");
const router = Router();

const { getTitleDetails, getPGDetails } = require("../controllers/media.controller");

router.get("/title/:id", getTitleDetails);
router.get("/title/:id/pg", getPGDetails);

module.exports = router;

