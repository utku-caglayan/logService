const express = require('express');
const logsController = require("../controllers/logs-controller");

exports.post = (app) => {
    const router = express.Router({mergeParams: true});
    // Producer route
    router.post("/create", logsController.createLogs);
    app.use("/logs", router)
}

exports.analytics = (app) => {
    const router = express.Router({mergeParams: true});
    router.get("/daily-active-user", logsController.dailyActiveUser);
    router.get("/daily-avg-usage-duration", logsController.dailyAverageUserDuration);
    router.get("/total-user-count", logsController.totalUser);

    app.use("/logs/analytics", router)
}