const express = require('express');
const router = express.Router();
const { criar, listarPorExercicio, pendentes, responder } = require('../controllers/duvidasController');
const { autenticar, soProfessor } = require('../middlewares/autenticar');

router.get('/pendentes', autenticar, soProfessor, pendentes);
router.get('/', autenticar, listarPorExercicio);
router.post('/', autenticar, criar);
router.put('/:id/responder', autenticar, soProfessor, responder);

module.exports = router;