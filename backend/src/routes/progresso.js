const express = require('express');
const router = express.Router();
const { listar, marcar, desmarcar } = require('../controllers/progressoController');
const { autenticar } = require('../middlewares/autenticar');

router.use(autenticar);

router.get('/', listar);
router.put('/:tipo/:id', marcar);
router.delete('/:tipo/:id', desmarcar);

module.exports = router;