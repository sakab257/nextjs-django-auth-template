// app/(protected)/layout.tsx
import { AuthProvider } from "@/contexts/AuthContext";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}