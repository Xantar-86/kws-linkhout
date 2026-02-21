import { redirect } from "next/navigation";

export default function NieuwsTestRedirect() {
  // Redirect naar de echte nieuws pagina
  redirect("/nieuws");
}
