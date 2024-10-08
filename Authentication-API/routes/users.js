const express = require("express");
const userCtrl = require("../controller/user");
const groupCtrl = require("../controller/group");
const isAuthenticated = require("../middlewares/isAuth");

const router = express.Router();

// Auth
router.post("/api/users/register", userCtrl.register);
router.post("/api/users/login", userCtrl.login);
router.get("/api/users/profile", isAuthenticated, userCtrl.profile);
router.get("/api/users/groups", isAuthenticated, userCtrl.getUserGroups);
router.put("/api/users/profile", isAuthenticated, userCtrl.updateProfile);

// Groups
router.post("/api/groups", isAuthenticated, groupCtrl.createGroup);
router.post("/api/groups/add", isAuthenticated, groupCtrl.addUserToGroup);
router.get("/api/groups/:id", isAuthenticated, groupCtrl.getGroupById);
router.post("/api/groups/:id/checkin", isAuthenticated, groupCtrl.checkIn);

module.exports = router;