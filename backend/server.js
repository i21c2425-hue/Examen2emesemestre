const express = require('express');
const cors = require('cors');
require('dotenv').config();

const produitRoutes = require('./routes/produitRoutes');
const commandeRoutes = require('./routes/commandeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/produits', produitRoutes);
app.use('/api/commandes', commandeRoutes);

// petite route juste pour verifier que l'API tourne bien
app.get('/', (req, res) => {
  res.send('API Gestion des Commandes et Produits - ca fonctionne');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur demarre sur http://localhost:${PORT}`);
});
