"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

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
            setError(err instanceof Error ? err.message : "Erreur");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input name="username" placeholder="boussa" required />
            <input name="email" type="email" placeholder="salim.bouskine@dauphine.eu" required />
            <input name="first_name" placeholder="Salim" required />
            <input name="last_name" placeholder="Bouskine" required />
            <input name="password" type="password" placeholder="********" required />
            <input name="password2" type="password" placeholder="********" required />
            <button type="submit">S'inscrire</button>
        </form>
    );
}

export default SignUpPage