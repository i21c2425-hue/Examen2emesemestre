const db = require('../config/db');

// GET /api/commandes
// liste toutes les commandes avec les infos du client
exports.getAllCommandes = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT co.*, cl.nom, cl.prenom, cl.email
       FROM commandes co
       JOIN clients cl ON co.id_client = cl.id_client
       ORDER BY co.date_commande DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/commandes/:id/lignes
// le detail produit par produit d'une commande donnee
exports.getCommandeDetail = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT lc.*, p.nom_produit
       FROM ligne_commande lc
       JOIN produits p ON lc.id_produit = p.id_produit
       WHERE lc.id_commande = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/commandes
// body : { id_client, produits: [{ id_produit, quantite }, ...] }
//
// Ici j'utilise une transaction parce qu'on touche a plusieurs tables
// d'un coup (commandes + ligne_commande + stock des produits), si un truc
// foire au milieu (ex: stock insuffisant) on annule tout avec rollback
// plutot que de se retrouver avec une commande a moitie enregistree.
exports.createCommande = async (req, res) => {
  const { id_client, produits } = req.body;

  if (!produits || produits.length === 0) {
    return res.status(400).json({ message: 'La commande doit contenir au moins un produit' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [cmdResult] = await connection.query(
      "INSERT INTO commandes (id_client, statut, montant_total) VALUES (?, 'En attente', 0)",
      [id_client]
    );
    const id_commande = cmdResult.insertId;

    let montant_total = 0;

    for (const item of produits) {
      const [prodRows] = await connection.query(
        'SELECT prix, stock FROM produits WHERE id_produit = ?',
        [item.id_produit]
      );

      if (prodRows.length === 0) {
        throw new Error(`Produit ${item.id_produit} introuvable`);
      }
      if (prodRows[0].stock < item.quantite) {
        throw new Error(`Stock insuffisant pour le produit ${item.id_produit}`);
      }

      const prix_unitaire = prodRows[0].prix;
      montant_total += prix_unitaire * item.quantite;

      await connection.query(
        'INSERT INTO ligne_commande (id_commande, id_produit, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
        [id_commande, item.id_produit, item.quantite, prix_unitaire]
      );

      await connection.query(
        'UPDATE produits SET stock = stock - ? WHERE id_produit = ?',
        [item.quantite, item.id_produit]
      );
    }

    await connection.query(
      'UPDATE commandes SET montant_total = ? WHERE id_commande = ?',
      [montant_total, id_commande]
    );

    await connection.commit();
    res.status(201).json({ id_commande, montant_total });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// PUT /api/commandes/:id/statut
exports.updateStatutCommande = async (req, res) => {
  const { statut } = req.body;

  try {
    await db.query('UPDATE commandes SET statut = ? WHERE id_commande = ?', [statut, req.params.id]);
    res.json({ message: 'Statut mis a jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
