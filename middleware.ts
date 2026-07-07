'use client';

import { useEffect, useMemo, useState } from 'react';

type Tab = 'home' | 'focus' | 'circle' | 'room' | 'places';
type RoomResponse = {
  ok: boolean;
  mode: 'demo' | 'zoom';
  topic: string;
  join_url: string;
  start_url?: string;
  meeting_id?: string;
  passcode?: string;
  message?: string;
};

const actions = [
  {
    key: 'focus' as const,
    title: 'Fokus 25 menit',
    desc: 'Tulis target kecil, mulai timer, selesai dengan ringkasan.',
    icon: '◌'
  },
  {
    key: 'circle' as const,
    title: 'Cari circle',
    desc: 'Temukan teman belajar kecil, bukan grup ramai yang melelahkan.',
    icon: '✦'
  },
  {
    key: 'room' as const,
    title: 'Buat room online',
    desc: 'Siapkan ruang Zoom untuk diskusi, kelas mini, atau belajar bareng.',
    icon: '⌁'
  }
];

const circles = [
  { name: 'Skripsi Tenang', tag: 'Skripsi', members: 12, vibe: 'sunyi + akuntabel' },
  { name: 'OSCE Malam', tag: 'Kedokteran', members: 8, vibe: 'latihan cepat' },
  { name: 'UTBK Sprint', tag: 'SMA', members: 19, vibe: 'target harian' },
  { name: 'Coding Santai', tag: 'Teknologi', members: 15, vibe: 'pair learning' }
];

const places = [
  { name: 'Perpustakaan Kampus', meta: 'sunyi · colokan · gratis', score: '92%' },
  { name: 'Kafe Produktif', meta: 'wifi · diskusi kecil · Rp20k+', score: '86%' },
  { name: 'Ruang Organisasi', meta: 'ramai · cocok meeting · kampus', score: '78%' }
];

function format(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function RuangTemuApp() {
  const [tab, setTab] = useState<Tab>('home');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [target, setTarget] = useState('Baca 5 halaman dan catat 3 poin penting');
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [roomTopic, setRoomTopic] = useState('Belajar bareng malam ini');
  const [roomLoading, setRoomLoading] = useState(false);
  const [room, setRoom] = useState<RoomResponse | null>(null);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const progress = useMemo(() => 100 - (seconds / (25 * 60)) * 100, [seconds]);

  async function createOnlineRoom() {
    setRoomLoading(true);
    setRoom(null);
    try {
      const res = await fetch('/api/zoom/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: roomTopic, duration: 60 })
      });
      const data = (await res.json()) as RoomResponse;
      setRoom(data);
    } catch (error) {
      setRoom({
        ok: false,
        mode: 'demo',
        topic: roomTopic,
        join_url: '#',
        message: 'Room belum bisa dibuat. Periksa koneksi atau konfigurasi backend.'
      });
    } finally {
      setRoomLoading(false);
    }
  }

  return (
    <main className={reducedMotion ? 'app reduce-motion' : 'app'}>
      <div className="water-bg" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
        <span className="wave w1" />
        <span className="wave w2" />
      </div>

      <nav className="topbar glass">
        <button className="brand" onClick={() => setTab('home')}>
          <span className="brand-mark">RT</span>
          <span>
            <strong>Ruang Temu</strong>
            <small>social productivity</small>
          </span>
        </button>
        <div className="nav-actions">
          {(['home', 'focus', 'circle', 'room', 'places'] as Tab[]).map((item) => (
            <button key={item} className={tab === item ? 'nav active' : 'nav'} onClick={() => setTab(item)}>
              {item === 'home' ? 'Beranda' : item === 'focus' ? 'Fokus' : item === 'circle' ? 'Circle' : item === 'room' ? 'Room' : 'Tempat'}
            </button>
          ))}
        </div>
        <button className="quiet" onClick={() => setReducedMotion((v) => !v)}>
          {reducedMotion ? 'Animasi on' : 'Kurangi animasi'}
        </button>
      </nav>

      {tab === 'home' && (
        <section className="hero">
          <div className="hero-copy glass deep">
            <p className="eyebrow">Prototype aplikasi sungguhan</p>
            <h1>Belajar tidak harus sendirian.</h1>
            <p className="lead">Pilih satu aksi kecil. Ruang Temu bantu kamu fokus, menemukan circle, atau membuat room online tanpa dashboard yang melelahkan.</p>
            <div className="action-grid">
              {actions.map((action) => (
                <button key={action.key} className="action-card glass" onClick={() => setTab(action.key)}>
                  <span className="action-icon">{action.icon}</span>
                  <strong>{action.title}</strong>
                  <small>{action.desc}</small>
                </button>
              ))}
            </div>
          </div>
          <aside className="phone glass">
            <div className="phone-glow" />
            <div className="phone-top" />
            <div className="mood-card">
              <span>Hari ini</span>
              <strong>Aku ingin mulai pelan-pelan.</strong>
            </div>
            <div className="mini-orb" />
            <div className="mini-list">
              <p>1 target kecil</p>
              <p>1 circle tenang</p>
              <p>1 room siap pakai</p>
            </div>
          </aside>
        </section>
      )}

      {tab === 'focus' && (
        <section className="panel glass deep focus-panel">
          <div>
            <p className="eyebrow">Ruang Fokus</p>
            <h2>{format(seconds)}</h2>
            <p className="lead small">Satu sesi kecil lebih baik daripada rencana besar yang tidak dimulai.</p>
          </div>
          <label className="input-wrap">
            Target sesi ini
            <input value={target} onChange={(e) => setTarget(e.target.value)} />
          </label>
          <div className="progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="button-row">
            <button className="primary" onClick={() => setRunning((v) => !v)}>{running ? 'Jeda' : 'Mulai'}</button>
            <button className="secondary" onClick={() => { setRunning(false); setSeconds(25 * 60); }}>Reset</button>
          </div>
          <div className="insight glass">
            <strong>AI ringkas:</strong> Mulai dari 10 menit pertama. Jangan buka tab lain. Setelah selesai, tulis hasil dalam 3 kalimat.
          </div>
        </section>
      )}

      {tab === 'circle' && (
        <section className="panel glass deep">
          <p className="eyebrow">Circle kecil</p>
          <h2>Pilih ruang yang terasa aman.</h2>
          <div className="cards">
            {circles.map((circle) => (
              <article className="item glass" key={circle.name}>
                <div>
                  <span className="pill">{circle.tag}</span>
                  <h3>{circle.name}</h3>
                  <p>{circle.vibe}</p>
                </div>
                <strong>{circle.members} orang</strong>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'room' && (
        <section className="panel glass deep">
          <p className="eyebrow">Room online</p>
          <h2>Buat ruang Zoom dari aplikasi.</h2>
          <p className="lead small">Jika kredensial Zoom belum dipasang, tombol ini mengeluarkan demo link. Setelah env Zoom aktif, backend akan membuat meeting asli.</p>
          <label className="input-wrap">
            Nama room
            <input value={roomTopic} onChange={(e) => setRoomTopic(e.target.value)} />
          </label>
          <button className="primary" onClick={createOnlineRoom} disabled={roomLoading}>{roomLoading ? 'Membuat room...' : 'Buat room online'}</button>
          {room && (
            <div className="room-result glass">
              <span className="pill">{room.mode === 'zoom' ? 'Zoom asli' : 'Demo mode'}</span>
              <h3>{room.topic}</h3>
              <p>{room.message ?? 'Room berhasil dibuat.'}</p>
              {room.meeting_id && <p><b>Meeting ID:</b> {room.meeting_id}</p>}
              {room.passcode && <p><b>Passcode:</b> {room.passcode}</p>}
              <a className="primary link" href={room.join_url} target="_blank" rel="noreferrer">Masuk room</a>
            </div>
          )}
        </section>
      )}

      {tab === 'places' && (
        <section className="panel glass deep">
          <p className="eyebrow">Tempat produktif</p>
          <h2>Rekomendasi tempat belajar.</h2>
          <div className="cards">
            {places.map((place) => (
              <article className="item glass" key={place.name}>
                <div>
                  <h3>{place.name}</h3>
                  <p>{place.meta}</p>
                </div>
                <strong>{place.score}</strong>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
