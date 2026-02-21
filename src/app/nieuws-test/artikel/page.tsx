import { redirect } from "next/navigation";

export default function NieuwsTestArtikelRedirect() {
  // Redirect naar de echte artikel pagina
  redirect("/nieuws/artikel");
}
