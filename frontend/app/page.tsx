// app/page.tsx
import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  return (
    // Conteneur principal pleine hauteur avec un fond subtil
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-50 via-gray-50 to-white p-6">
      
      {/* Section Hero centrée */}
      <main className="flex max-w-3xl flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Icône ou Logo */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 rotate-3 transition-transform hover:rotate-6">
          <LayoutDashboard size={40} />
        </div>
        
        {/* Titre principal */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          Bienvenue sur votre <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">Nouvelle Application</span>
        </h1>
        
        {/* Sous-titre / Description */}
        <p className="mt-6 max-w-xl text-lg text-gray-300 leading-relaxed">
          Une interface moderne, rapide et sécurisée. Connectez-vous pour accéder à votre tableau de bord ou créez un compte pour commencer.
        </p>
        
        {/* Boutons d'action */}
        <div className="mt-10 flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-4">
          {/* Bouton Inscription (Primaire) */}
          <Link 
            href="/signup" 
            className="group relative flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-500 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 ring-offset-2 focus:ring-2 focus:ring-blue-500"
          >
            Commencer maintenant
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          
          {/* Bouton Connexion (Secondaire) */}
          <Link 
            href="/signin"
            className="flex w-full sm:w-auto cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 bg-white px-8 py-3.5 text-sm font-bold text-gray-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
          >
            J'ai déjà un compte
          </Link>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="absolute bottom-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Sakab. Tous droits réservés.
      </footer>
    </div>
  );
}