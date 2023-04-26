const express = require('express');
const router = express.Router();

router.post('/register', function(request, response) {
  res.send('respond with a resource');
});

module.exports = router;