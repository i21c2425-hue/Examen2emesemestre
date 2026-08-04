import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

// icones SVG inline
const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
  </svg>
);
const IconBoxEmpty = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 8 12 3 3 8l9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8" />
  </svg>
);

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [form, setForm] = useState({
    nom_produit: '',
    description: '',
    prix: '',
    stock: '',
    id_categorie: ''
  });

  useEffect(() => {
    chargerProduits();
  }, []);

  async function chargerProduits() {
    try {
      setChargement(true);
      const res = await axiosClient.get('/produits');
      setProduits(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setChargement(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnvoiEnCours(true);

    try {
      await axiosClient.post('/produits', form);
      // on vide le formulaire et on recharge la liste
      setForm({ nom_produit: '', description: '', prix: '', stock: '', id_categorie: '' });
      chargerProduits();
    } catch (err) {
      alert("Erreur lors de l'ajout du produit");
      console.log(err);
    } finally {
      setEnvoiEnCours(false);
    }
  }

  async function handleDelete(id) {
    const confirmation = window.confirm('Supprimer ce produit ?');
    if (!confirmation) return;

    try {
      await axiosClient.delete(`/produits/${id}`);
      chargerProduits();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Produits</h1>
        <p className="text-sm text-slate-500 mt-1">Gerez votre catalogue de produits et leur stock.</p>
      </div>

      {/* Formulaire d'ajout */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5 mb-8 max-w-2xl"
      >
        <h2 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">
          Ajouter un produit
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Nom du produit</label>
            <input
              name="nom_produit"
              value={form.nom_produit}
              onChange={handleChange}
              placeholder="Ex : Clavier mecanique"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Prix (Ar)</label>
            <input
              name="prix"
              value={form.prix}
              onChange={handleChange}
              placeholder="0.00"
              type="number"
              step="0.01"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Stock</label>
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              type="number"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">ID categorie</label>
            <input
              name="id_categorie"
              value={form.id_categorie}
              onChange={handleChange}
              placeholder="Optionnel"
              type="number"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Courte description du produit"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={envoiEnCours}
          className="mt-5 inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <IconPlus className="w-4 h-4" />
          {envoiEnCours ? 'Ajout en cours...' : 'Ajouter le produit'}
        </button>
      </form>

      {/* Liste des produits */}
      {chargement ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Chargement des produits...
        </div>
      ) : produits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white border border-dashed border-slate-300 rounded-2xl">
          <IconBoxEmpty className="w-10 h-10 mb-3 text-slate-300" />
          <p className="text-sm">Aucun produit pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Nom</th>
                  <th className="px-4 py-3 text-left font-semibold">Prix</th>
                  <th className="px-4 py-3 text-left font-semibold">Stock</th>
                  <th className="px-4 py-3 text-left font-semibold">Categorie</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produits.map((p) => (
                  <tr key={p.id_produit} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{p.nom_produit}</td>
                    <td className="px-4 py-3 text-slate-600">{p.prix} Ar</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          Number(p.stock) === 0
                            ? 'bg-red-100 text-red-700'
                            : Number(p.stock) < 5
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.nom_categorie || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(p.id_produit)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg text-xs font-medium transition"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
