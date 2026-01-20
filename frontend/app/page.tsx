// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Bienvenue</h1>
      <Link href="/signin">Se connecter</Link>
      <Link href="/signup">S'inscrire</Link>
    </div>
  );
}