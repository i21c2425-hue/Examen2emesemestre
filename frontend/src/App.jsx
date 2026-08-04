import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Produits from './pages/Produits.jsx';
import Commandes from './pages/Commandes.jsx';

// petites icones SVG inline (pas de dependance supplementaire a installer)
function IconBox(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

function IconClipboard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 10h6M9 14h6M9 18h3" />
    </svg>
  );
}

function NavItem({ to, icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-white/15 text-white'
            : 'text-slate-300 hover:text-white hover:bg-white/10'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
                GC
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Gestion Commandes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <NavItem to="/" end icon={<IconBox className="w-4 h-4" />} label="Produits" />
              <NavItem to="/commandes" icon={<IconClipboard className="w-4 h-4" />} label="Commandes" />
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Produits />} />
            <Route path="/commandes" element={<Commandes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
