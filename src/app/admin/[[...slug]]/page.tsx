import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect directly to admin-static - no iframe, no layout complications
  redirect('/admin-static/');
}
