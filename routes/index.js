var express = require('express');
const controller = require('../controllers/redireciona');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/ultimoDia', controller.ultimoDia)

module.exports = router;
