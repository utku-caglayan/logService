const express = require('express');
const router = express();
const logsController = require("../controllers/logs-controller");

router.get("/", logsController.logs);
// Producer route
router.post("/create", logsController.createLogs);

// Query routes
router.get("/daily-active-user", logsController.dailyActiveUser);
router.get("/daily-avg-usage-duration", logsController.dailyAverageUserDuration);
router.get("/total-user-count", logsController.totalUser);


module.exports = router;