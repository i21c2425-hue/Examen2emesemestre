const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');

router.get('/', commandeController.getAllCommandes);
router.get('/:id/lignes', commandeController.getCommandeDetail);
router.post('/', commandeController.createCommande);
router.put('/:id/statut', commandeController.updateStatutCommande);

module.exports = router;
