"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, User, Mail, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
    const { user, loading, loggingOut, logout } = useAuth();
    const router = useRouter();

    async function handleLogout() {
        await logout();
        router.replace("/signin");
    }

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3 text-blue-600">
                    <Loader2 className="h-10 w-10 animate-spin" />
                    <p className="text-sm font-medium text-gray-600">Chargement du dashboard...</p>
                </div>
            </div>
        );
    }

    if (loggingOut) return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-3 text-blue-600">
                <Loader2 className="h-10 w-10 animate-spin" />
                <p className="text-sm font-medium text-gray-600">Chargement...</p>
            </div>
        </div>
    );
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="border-b bg-white px-6 py-4 shadow-sm">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <button 
                        onClick={handleLogout}
                        className="group flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:border-red-100 hover:text-red-700 active:scale-95"
                    >
                        <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </nav>

            {/* Contenu */}
            <main className="mx-auto max-w-5xl p-6 md:p-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Bonjour, {user.first_name}.</h2>
                    <p className="text-gray-500 mt-2">Ravi de vous revoir sur votre espace.</p>
                </div>

                {/* Carte Profil */}
                <div className="overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm md:max-w-md transition-all hover:shadow-md">
                    <div className="bg-linear-to-r from-blue-50 to-indigo-50/50 p-6 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue-600 font-bold text-xl shadow-sm border border-blue-100">
                                {user.first_name[0].toUpperCase()}{user.last_name[0].toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{user.first_name} {user.last_name}</h3>
                                <p className="text-sm text-gray-500">Utilisateur</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                <Mail size={16} />
                            </div>
                            <span className="text-gray-700 font-medium">{user.email}</span>
                        </div>
                        
                        {/* Check si le username existe avant de l'afficher */}
                            {user.username && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                    <User size={16} />
                                </div>
                                <span className="text-gray-700 font-medium">@{user.username}</span>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}