const express = require('express');
const router = express.Router();
const { criar, listar, remover } = require('../controllers/referenciasController');
const { autenticar, soProfessor } = require('../middlewares/autenticar');
const upload = require('../middlewares/upload');

// Captura erros do multer (tipo errado, arquivo grande) e responde 400
function receberArquivo(req, res, next) {
    upload.single('arquivo')(req, res, (err) => {
        if (err) return res.status(400).json({ erro: err.message });
        next();
    });
}

router.get('/', autenticar, listar);
router.post('/', autenticar, soProfessor, receberArquivo, criar);
router.delete('/:id', autenticar, soProfessor, remover);

module.exports = router;