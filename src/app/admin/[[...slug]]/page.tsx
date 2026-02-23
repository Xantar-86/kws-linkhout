import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Direct naar admin-static (Decap CMS handelt login zelf)
  redirect('/admin-static/');
}
