const router = require("express").Router();
const verifyToken = require("../middlewares/authJwt");
const controller = require('../controllers/file.controller');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

const upload = multer({ storage: storage });

router.post("/upload", verifyToken, upload.single('file'), controller.uploadFile);
router.get("/list", verifyToken, controller.getFileList);
router.get("/:id", verifyToken, controller.getFileById);
router.get("/download/:id", verifyToken, controller.downloadFile);
router.put("/update/:id", verifyToken, upload.single("file"), controller.updateFile);
router.delete("/delete/:id", verifyToken, controller.deleteFile);

module.exports = router;