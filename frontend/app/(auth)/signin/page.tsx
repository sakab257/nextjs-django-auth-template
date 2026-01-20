"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);

        try {
            await signIn({
                    username: formData.get("username") as string,
                    password: formData.get("password") as string
                }
            );
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input name="username" placeholder="Nom d'utilisateur" required />
            <input name="password" type="password" placeholder="Mot de passe" required />
            <button type="submit">Se connecter</button>
        </form>
    );
}