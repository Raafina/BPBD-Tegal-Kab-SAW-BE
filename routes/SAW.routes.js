const router = require("express").Router();
const SAWControllers = require("../controllers/SAW.controllers");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.route("/").get(authMiddleware("admin"), SAWControllers.getSAW_Results);
router
  .route("/send-mail")
  .post(authMiddleware("admin"), SAWControllers.sendMail_Results);
router.all("/calculate", SAWControllers.calculate);

module.exports = router;
