const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Company routes working" });
});

module.exports = router;