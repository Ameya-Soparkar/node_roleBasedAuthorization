const express = require("express")
const verifyToken = require("../middleware/authMiddleware")
const router = express.Router()
const authorisedRoles = require("../middleware/roleMiddleware")


router.get("/admin", verifyToken , authorisedRoles("admin"), (req, res) => {
        res.json({message: 'welcome admin'})
})

router.get("/manager", verifyToken, authorisedRoles("admin", "manager"), (req, res) => {
    res.json({message: 'welcome manager'})
})

router.get("/user", verifyToken, authorisedRoles("admin", "manager", "user"), (req, res) => {
    res.json({message: 'welcome user'})
})

module.exports = router