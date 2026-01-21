"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, UserPlus, Eye, EyeOff } from "lucide-react"; // Ajout des icones

const SignUpPage = () => {
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Ajout de l'état pour la visibilité
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            await signUp({
                username: formData.get("username") as string,
                email: formData.get("email") as string,
                first_name: formData.get("first_name") as string,
                last_name: formData.get("last_name") as string,
                password: formData.get("password") as string,
                password2: formData.get("password2") as string,
            }
            );
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription");
            setIsSubmitting(false); 
        }
    }

    // Note l'ajout de 'pr-10' dans la classe pour laisser la place à l'icone à droite
    const inputClass = "mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm transition-all disabled:bg-gray-50 disabled:cursor-not-allowed";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    // Fonction helper pour le bouton toggle pour éviter de dupliquer le code JSX
    const PasswordToggle = () => (
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            tabIndex={-1} // Empêche le tab focus sur l'oeil pour aller directement au champ suivant
        >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
    );

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg space-y-8 bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <UserPlus size={24} />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Créer un compte</h2>
                    <p className="mt-2 text-sm text-gray-600">Rejoignez la communauté en quelques secondes.</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={20} className="shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>Prénom <span className="text-red-500">*</span></label>
                                <input name="first_name" placeholder="Prénom" required disabled={isSubmitting} className={inputClass.replace("pr-10", "")} />
                            </div>
                            <div>
                                <label className={labelClass}>Nom <span className="text-red-500">*</span></label>
                                <input name="last_name" placeholder="Nom" required disabled={isSubmitting} className={inputClass.replace("pr-10", "")} />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Nom d'utilisateur <span className="text-red-500">*</span></label>
                            <input name="username" placeholder="utilisateur" required disabled={isSubmitting} className={inputClass.replace("pr-10", "")} />
                        </div>

                        <div>
                            <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                            <input name="email" type="email" placeholder="email@exemple.com" required disabled={isSubmitting} className={inputClass.replace("pr-10", "")} />
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="relative">
                                <label className={labelClass}>Mot de passe <span className="text-red-500">*</span></label>
                                <input 
                                    name="password" 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    required 
                                    disabled={isSubmitting} 
                                    className={inputClass} 
                                />
                                <PasswordToggle />
                            </div>
                            <div className="relative">
                                <label className={labelClass}>Confirmation <span className="text-red-500">*</span></label>
                                <input 
                                    name="password2" 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    required 
                                    disabled={isSubmitting} 
                                    className={inputClass} 
                                />
                                <PasswordToggle />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-600 active:scale-[0.98] mt-8"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Inscription en cours...</span>
                            </>
                        ) : (
                            "S'inscrire maintenant"
                        )}
                    </button>
                    
                    <div className="text-center text-sm mt-6">
                        <span className="text-gray-500">Déjà un compte ? </span>
                        <a href="/signin" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all">
                            Se connecter
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage