const express = require("express");
const router = express.Router();
const multer = require("multer");
const taskController = require("../controllers/taskController");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", taskController.getTasks);
router.post("/", upload.single("linkedFile"), taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.get("/:id/download", taskController.downloadFile);

module.exports = router;
m;
