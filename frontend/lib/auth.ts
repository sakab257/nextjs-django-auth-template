import { AxiosError } from "axios";
import api from "@/lib/axios";
import { User } from "@/lib/types"

interface SignInData {
    username: string;
    password: string;
}

interface SignUpData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password2: string;
}

export async function signIn(data: SignInData): Promise<User> {
    try {
        const response = await api.post("/auth/signin/", data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || "Identifiants incorrects");
        }
        throw new Error("Erreur de connexion");
    }
}

export async function signUp(
    data: SignUpData
): Promise<User> {
    try {
        const response = await api.post("/auth/signup/", data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || "Erreur lors de l'inscription");
        }
        throw new Error("Erreur de connexion");
    }
}

export async function signOut(): Promise<void> {
    await api.post("/auth/signout/");
}

export async function getMe(): Promise<User> {
    const response = await api.get("/auth/me/");
    return response.data;
}

export async function refresh(): Promise<void> {
    await api.post("/auth/refresh/");
}