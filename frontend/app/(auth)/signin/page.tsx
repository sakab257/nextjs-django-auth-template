"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Lock, User, AlertCircle, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            await signIn({
                    username: formData.get("username") as string,
                    password: formData.get("password") as string
                }
            );
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la connexion");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Connexion</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Accédez à votre espace personnel.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={20} className="shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                name="username"
                                placeholder="Nom d'utilisateur"
                                required
                                disabled={isSubmitting}
                                className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        
                        <div className="relative group">
                            {/* Icone Cadenas à Gauche */}
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <Lock size={18} />
                            </div>
                            
                            <input
                                name="password"
                                // Changement dynamique du type
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                disabled={isSubmitting}
                                // Note le 'pr-10' pour l'icone oeil et 'pl-10' pour l'icone cadenas
                                className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />

                            {/* Bouton Toggle à Droite */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-600 active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Connexion en cours...</span>
                            </>
                        ) : (
                            <>
                                <span>Se connecter</span>
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                    
                    <div className="text-center text-sm mt-6">
                        <span className="text-gray-500">Pas encore de compte ? </span>
                        <a href="/signup" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all">
                            Créer un compte
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}