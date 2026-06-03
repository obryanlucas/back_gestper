
const express = require('express');
const router = express.Router();
const multer = require('multer');

const faltasController = require('../controllers/falta.controller');

const upload = multer({ dest: 'uploads/' });

/* =========================
   IMPORTAR FALTAS
========================= */
router.post(
  '/importar-faltas',
  upload.fields([
    { name: 'faltas', maxCount: 1 },
    { name: 'base', maxCount: 1 }
  ]),
  faltasController.importarFaltas
);



module.exports = router;