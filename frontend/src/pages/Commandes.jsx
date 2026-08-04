import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const IconClipboardEmpty = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
  </svg>
);

const STATUT_STYLES = {
  'En attente': 'bg-slate-100 text-slate-600 ring-slate-300',
  Validee: 'bg-blue-100 text-blue-700 ring-blue-300',
  Expediee: 'bg-amber-100 text-amber-700 ring-amber-300',
  Livree: 'bg-emerald-100 text-emerald-700 ring-emerald-300',
  Annulee: 'bg-red-100 text-red-700 ring-red-300'
};

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerCommandes();
  }, []);

  async function chargerCommandes() {
    try {
      setChargement(true);
      const res = await axiosClient.get('/commandes');
      setCommandes(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setChargement(false);
    }
  }

  async function changerStatut(id, nouveauStatut) {
    try {
      await axiosClient.put(`/commandes/${id}/statut`, { statut: nouveauStatut });
      chargerCommandes(); // on recharge pour etre sur d'avoir la bonne valeur
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Commandes</h1>
        <p className="text-sm text-slate-500 mt-1">Suivez et mettez a jour le statut de chaque commande.</p>
      </div>

      {chargement ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Chargement des commandes...
        </div>
      ) : commandes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white border border-dashed border-slate-300 rounded-2xl">
          <IconClipboardEmpty className="w-10 h-10 mb-3 text-slate-300" />
          <p className="text-sm">Aucune commande enregistree pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">N°</th>
                  <th className="px-4 py-3 text-left font-semibold">Client</th>
                  <th className="px-4 py-3 text-left font-semibold">Montant</th>
                  <th className="px-4 py-3 text-left font-semibold">Statut</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commandes.map((c) => (
                  <tr key={c.id_commande} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">#{c.id_commande}</td>
                    <td className="px-4 py-3 text-slate-600">{c.nom} {c.prenom}</td>
                    <td className="px-4 py-3 text-slate-600">{c.montant_total} Ar</td>
                    <td className="px-4 py-3">
                      <select
                        value={c.statut}
                        onChange={(e) => changerStatut(c.id_commande, e.target.value)}
                        className={`text-xs font-medium rounded-full px-3 py-1.5 ring-1 ring-inset border-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer transition ${
                          STATUT_STYLES[c.statut] || 'bg-slate-100 text-slate-600 ring-slate-300'
                        }`}
                      >
                        <option value="En attente">En attente</option>
                        <option value="Validee">Validee</option>
                        <option value="Expediee">Expediee</option>
                        <option value="Livree">Livree</option>
                        <option value="Annulee">Annulee</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(c.date_commande).toLocaleDateString('fr-FR')}
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
