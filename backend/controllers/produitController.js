const db = require('../config/db');

// GET /api/produits
// je recupere tous les produits + le nom de la categorie associee
exports.getAllProduits = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nom_categorie
       FROM produits p
       LEFT JOIN categories c ON p.id_categorie = c.id_categorie`
    );
    res.json(rows);
  } catch (err) {
    console.log('erreur getAllProduits :', err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/produits/:id
exports.getProduitById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM produits WHERE id_produit = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouve' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/produits
exports.createProduit = async (req, res) => {
  const { nom_produit, description, prix, stock, id_categorie } = req.body;

  console.log("Données reçues :", req.body);

  if (!nom_produit || !prix) {
      return res.status(400).json({ message: "Le nom et le prix sont obligatoires" });
  }

  try {
      const [result] = await db.query(
          'INSERT INTO produits (nom_produit, description, prix, stock, id_categorie) VALUES (?, ?, ?, ?, ?)',
          [nom_produit, description, prix, stock, id_categorie]
      );

      console.log("Insertion réussie ID :", result.insertId);

      res.status(201).json({
          id_produit: result.insertId,
          ...req.body
      });

  } catch (err) {
      console.log("Erreur ajoutProduit :", err.message);
      res.status(500).json({ error: err.message });
  }
};

// PUT /api/produits/:id
exports.updateProduit = async (req, res) => {
  const { nom_produit, description, prix, stock, id_categorie } = req.body;

  try {
    await db.query(
      'UPDATE produits SET nom_produit=?, description=?, prix=?, stock=?, id_categorie=? WHERE id_produit=?',
      [nom_produit, description, prix, stock, id_categorie, req.params.id]
    );

    res.json({ message: 'Produit mis a jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/produits/:id
exports.deleteProduit = async (req, res) => {
  try {
    await db.query('DELETE FROM produits WHERE id_produit = ?', [req.params.id]);
    res.json({ message: 'Produit supprime' });
  } catch (err) {
    // ca peut planter si le produit est deja lie a une commande (cle etrangere)
    res.status(500).json({ error: err.message });
  }
};
