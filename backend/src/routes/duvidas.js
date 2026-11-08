const express = require('express');
const router = express.Router();
const {
    criar, listarPorExercicio, pendentes, doProfessor, minhas,
    responder, marcarLida, marcarResolvida, publicas,
} = require('../controllers/duvidasController');
const { autenticar, soProfessor } = require('../middlewares/autenticar');

router.get('/pendentes', autenticar, soProfessor, pendentes);
router.get('/professor', autenticar, soProfessor, doProfessor);
router.get('/minhas', autenticar, minhas);
router.get('/', autenticar, listarPorExercicio);
router.get('/publicas', autenticar, publicas);
router.post('/', autenticar, criar);
router.put('/:id/responder', autenticar, soProfessor, responder);
router.put('/:id/lida', autenticar, soProfessor, marcarLida);
router.put('/:id/resolvida', autenticar, marcarResolvida);

module.exports = router;