import { NextResponse } from 'next/server';

// Placeholder route untuk tahap berikutnya.
// Setelah Supabase Auth aktif, endpoint ini bisa dihubungkan ke tabel public.rooms.
export async function GET() {
  return NextResponse.json({
    ok: true,
    rooms: [
      { id: 'demo-1', title: 'Skripsi Tenang', type: 'focus', online: true },
      { id: 'demo-2', title: 'OSCE Malam', type: 'circle', online: true }
    ]
  });
}
