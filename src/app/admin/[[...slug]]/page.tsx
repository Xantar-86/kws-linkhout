import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to custom login page
  redirect('/admin-static/login.html');
}
