const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

// routes classiques pour le CRUD des produits
router.get('/', produitController.getAllProduits);
router.get('/:id', produitController.getProduitById);
router.post('/', produitController.createProduit);
router.put('/:id', produitController.updateProduit);
router.delete('/:id', produitController.deleteProduit);

module.exports = router;
