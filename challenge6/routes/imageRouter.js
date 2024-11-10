const router = require("express").Router();
const multer = require("../libs/multer");
const MediaControllers = require("../controllers/mediaControllers");
const mediaControllers = require("../controllers/mediaControllers");

router.post(
  "/upload-image",
  multer.single("image"),
  MediaControllers.tambahImage
);

router.get("/showAll", multer.single("image"), MediaControllers.getAllImage);

router.get("/image/:id", multer.single("image"), mediaControllers.getImageId);

router.delete(
  "/image/:id",
  multer.single("image"),
  mediaControllers.deleteImage
);

router.put("/image/:id", multer.single("image"), mediaControllers.updateImage);

module.exports = router;
