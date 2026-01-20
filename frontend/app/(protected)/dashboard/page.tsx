"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    async function handleLogout() {
        await logout();
        router.push("/signin");
    }

    if (loading) return <p>Chargement...</p>;
    if (!user) return null;

    return (
        <div>
        <h1>Dashboard</h1>
        <p>Bonjour {user.first_name} {user.last_name}</p>
        <p>Email : {user.email}</p>
        <button onClick={handleLogout}>Déconnexion</button>
        </div>
    );
}