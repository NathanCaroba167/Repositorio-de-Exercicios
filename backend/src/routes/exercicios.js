const express = require('express');
const router = express.Router();
const { listar, buscarPorId, criar, atualizar, deletar } = require('../controllers/exerciciosController');
const { autenticar, soProfessor } = require('../middlewares/autenticar');

// Qualquer pessoa pode ver
router.get('/', listar);
router.get('/:id', buscarPorId);

// Só professor logado pode alterar
router.post('/', autenticar, soProfessor, criar);
router.put('/:id', autenticar, soProfessor, atualizar);
router.delete('/:id', autenticar, soProfessor, deletar);

module.exports = router;