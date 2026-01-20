"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getMe, signOut as authSignOut} from "@/lib/auth";
import { User } from "@/lib/types";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Charge l'utilisateur au démarrage
    async function loadUser() {
        try {
        const me = await getMe();
        setUser(me);
        } catch {
        setUser(null);
        } finally {
        setLoading(false);
        }
    }

    // Rafraîchit l'utilisateur (après modif profil par ex)
    async function refresh() {
        await loadUser();
    }

    // Déconnexion
    async function logout() {
        await authSignOut();
        setUser(null);
    }

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refresh, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé dans un AuthProvider");
    }
    return context;
}