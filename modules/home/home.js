const express = require('express');
const router = express.Router();

router.get('/:token', (req, res, next)=>{
    res.json({success : true, msg : "User registered"});
});
module.exports = router;