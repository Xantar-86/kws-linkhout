import { WachtwoordFormulier } from "../Formulieren";

export default async function Uitnodiging({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  return (
    <div className="mx-auto mt-10 grid max-w-sm gap-5 rounded-xl border border-zand-200 bg-white p-6 shadow-zacht">
      <div className="grid gap-1">
        <h1 className="font-display text-2xl font-bold uppercase">Welkom</h1>
        <p className="text-sm text-inkt-700">
          Kies een wachtwoord voor het spelersdossier van KWS Linkhout. Daarna meld je je aan met je e-mailadres en dit
          wachtwoord.
        </p>
      </div>
      {code ? <WachtwoordFormulier code={code} /> : <p className="text-sm text-primary-700">Deze link is onvolledig.</p>}
    </div>
  );
}
