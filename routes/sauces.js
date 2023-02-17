const express = require('express');
const router = express.Router();

const SaucePicture = require('../middleware/upload');
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');

//déclaration des methodes et des itinéraires employées par les routes
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id',auth, sauceCtrl.getOneSauce);
router.post('/', auth, SaucePicture, sauceCtrl.createSauce);
router.put('/:id',auth, SaucePicture, sauceCtrl.modifySauce);
router.delete('/:id',auth, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.likes);
module.exports = router;
