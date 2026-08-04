import { useState, useMemo, useEffect, useRef } from "react";
import {
  Navigation, MapPin, Fuel, Star, ChevronRight, Compass, User, Shield,
  CalendarDays, Upload, Trash2, Check, Plus, Loader2, Users, Bike, Route,
  Image as ImageIcon, UserPlus, UserCheck, Camera, Heart, Award, Crosshair, Lock
} from "lucide-react";

/* ---------------------------------------------------------------- */
/* Data: Rota Biker monuments                                       */
/* ---------------------------------------------------------------- */
const MONUMENTS = [
  { n: 1, name: "Serpenteando Café", city: "Bocaiúva do Sul", uf: "PR", lat: -25.0777701, lng: -49.0862979, note: "Berço da Rota Biker, no Rastro da Serpente", rating: 4.9 },
  { n: 2, name: "Fábrica Cafeteria", city: "Curitiba", uf: "PR", lat: -25.4697581, lng: -49.2303167, note: "Ponto de encontro na capital paranaense", rating: 4.6 },
  { n: 3, name: "Mirante do 12", city: "Lauro Müller", uf: "SC", lat: -28.3848397, lng: -49.4850811, note: "No topo da Serra do Rio do Rastro", rating: 4.7 },
  { n: 4, name: "Bar Rota 370", city: "Urubici", uf: "SC", lat: -27.9987446, lng: -49.5544447, note: "Serra Catarinense, parada obrigatória", rating: 4.6 },
  { n: 5, name: "Parada Rota PR 218", city: "Carlópolis", uf: "PR", lat: -23.4284914, lng: -49.7208716, note: "Norte pioneiro do Paraná", rating: 4.5 },
  { n: 6, name: "Rota Bike Café", city: "Rio dos Cedros", uf: "SC", lat: -26.6721412, lng: -49.3213261, note: "Gastronomia e cultura biker", rating: 4.9 },
  { n: 7, name: "Container da Serra", city: "Doutor Pedrinho", uf: "SC", lat: -26.7165719, lng: -49.4855659, note: "Trecho serrano de paisagens abertas", rating: 4.5 },
  { n: 8, name: "Parada 261", city: "Guapiara", uf: "SP", lat: -24.1898018, lng: -48.5367075, note: "Rastro da Serpente em solo paulista", rating: 4.8 },
  { n: 9, name: "Posto Rota 090", city: "Pirai do Sul", uf: "PR", lat: -24.5315575, lng: -49.9365949, note: "Ligação do interior paranaense", rating: 4.5 },
  { n: 10, name: "Terra Sul Motos", city: "Jaguarão", uf: "RS", lat: -32.5651057, lng: -53.3779216, note: "Fronteira com o Uruguai", rating: 4.6 },
  { n: 11, name: "Pad Bier Cervejaria", city: "Brasília", uf: "DF", lat: -15.9990196, lng: -47.5603231, note: "Único monumento no Distrito Federal", rating: 4.5 },
  { n: 12, name: "Centro Cultural Movimento", city: "Socorro", uf: "SP", lat: -22.5972528, lng: -46.5256306, note: "Museu do motociclismo brasileiro", rating: 4.7 },
  { n: 13, name: "Portal dos Campos", city: "Ponta Grossa", uf: "PR", lat: -25.1421648, lng: -49.9811553, note: "Camping e cabanas nos Campos Gerais", rating: 4.5 },
  { n: 14, name: "Parador 158", city: "Itaara", uf: "RS", lat: -29.6098669, lng: -53.7635122, note: "Serra gaúcha central", rating: 4.4 },
  { n: 15, name: "Garimpo em Atividade", city: "Ametista do Sul", uf: "RS", lat: -27.3616899, lng: -53.1815452, note: "Passeio subterrâneo pelas minas", rating: 4.8 },
  { n: 16, name: "Parador Paranapanema", city: "Piraju", uf: "SP", lat: -23.1958142, lng: -49.38196, note: "Às margens do rio Paranapanema", rating: 4.4 },
  { n: 17, name: "Pit Stop Canastra", city: "Vargem Bonita", uf: "MG", lat: -20.3373539, lng: -46.4251631, note: "Rota da Cachoeira Casca D'Anta", rating: 5.0 },
  { n: 19, name: "Rancho Terra Crua", city: "Salesópolis", uf: "SP", lat: -23.5339144, lng: -45.8495613, note: "Serra do Mar paulista", rating: 4.5 },
  { n: 20, name: "Casa Rural", city: "Barra do Ribeiro", uf: "RS", lat: -30.4642689, lng: -51.4942239, note: "Às margens da BR-116", rating: 4.4 },
  { n: 21, name: "Parada Penhasco", city: "Penha", uf: "SC", lat: -26.7998594, lng: -48.6136359, note: "Litoral catarinense, perto do Beto Carrero", rating: 4.5 },
  { n: 22, name: "Restaurante Mata Virgem", city: "Três Corações", uf: "MG", lat: -21.6144094, lng: -45.2614054, note: "Rodovia Fernão Dias, com cachoeira própria", rating: 4.5 },
  { n: 23, name: "Bar do Hélio", city: "Santo Antônio da Alegria", uf: "SP", lat: -21.0895949, lng: -47.1533268, note: "Interior paulista, rota tranquila", rating: 4.4 },
  { n: 24, name: "Poço do Caixão", city: "Timbé do Sul", uf: "SC", lat: -28.828738, lng: -49.8516263, note: "Pousada e camping na Serra Geral", rating: 4.8 },
  { n: 25, name: "Parque do Peão", city: "Barretos", uf: "SP", lat: -20.5093769, lng: -48.6014041, note: "Sede do Barretos Motorcycles", rating: 4.8 },
];

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const BRAZIL_CENTER = { lat: -14.235, lng: -51.9253 };
const uid = () => Math.random().toString(36).slice(2, 10);

/* ---------------------------------------------------------------- */
/* Design tokens (see inline <style> for fonts)                     */
/* bg #14110E · surface #1C1712 · surface-raised #221C16            */
/* border #33291F · accent (ignição) #E08A2E · accent-2 (freio) #B4442E */
/* text #F3ECE1 · text-muted #A79A88 · text-faint #6E6252            */
/* ---------------------------------------------------------------- */
function Field({ label, children }) {
  return (
    <div>
      <label className="mono text-[11px] uppercase tracking-[0.25em] text-[#8A7C69]">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
const inputCls =
  "w-full rounded-lg border border-[#33291F] bg-[#1C1712] px-3.5 py-3 text-sm text-[#F3ECE1] outline-none placeholder:text-[#5C5240] transition focus:border-[#E08A2E] focus:ring-2 focus:ring-[#E08A2E]/15";

function PrimaryButton({ children, tone = "accent", ...props }) {
  const tones = {
    accent: "bg-[#E08A2E] text-[#14110E] hover:bg-[#F0A24C] shadow-[0_4px_18px_-4px_rgba(224,138,46,0.55)]",
  };
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold uppercase tracking-wide transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#26201A] disabled:text-[#5C5240] disabled:shadow-none ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-[#2C251C] bg-[#1C1712] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)] transition hover:border-[#3B3022] ${className}`}
    >
      {children}
    </div>
  );
}

function Empty({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#2C251C] bg-[#1A150F] py-14 text-center">
      <Icon className="h-7 w-7 text-[#4A4030]" />
      <p className="mono text-xs text-[#5C5240]">{text}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* App shell                                                         */
/* ---------------------------------------------------------------- */
const TABS = [
  { id: "rota", label: "Rota", icon: Compass },
  { id: "passaporte", label: "Passaporte", icon: Award },
  { id: "feed", label: "Feed", icon: Camera },
  { id: "perfil", label: "Perfil", icon: User },
  { id: "comunidade", label: "Comunidade", icon: Users },
  { id: "motoclube", label: "Motoclube", icon: Shield },
  { id: "eventos", label: "Eventos", icon: CalendarDays },
];

export default function RotaBikerApp() {
  const [tab, setTab] = useState("rota");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    id: "", nome: "", cidade: "", modeloMoto: "", pertenceMotoclube: false, nomeMotoclube: "", publico: true,
  });
  const [eventos, setEventos] = useState([]);
  const [comunidade, setComunidade] = useState([]);
  const [feed, setFeed] = useState([]);
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    (async () => {
      let loadedProfile = null;
      try {
        const p = await window.storage.get("profile", false);
        if (p) {
          loadedProfile = JSON.parse(p.value);
          if (!loadedProfile.id) loadedProfile.id = uid();
          setProfile(loadedProfile);
        }
      } catch {}
      try {
        const ev = await window.storage.get("eventos", true);
        if (ev) setEventos(JSON.parse(ev.value));
      } catch {}
      try {
        const cm = await window.storage.get("comunidade", true);
        if (cm) setComunidade(JSON.parse(cm.value));
      } catch {}
      try {
        const fd = await window.storage.get("feed", true);
        if (fd) setFeed(JSON.parse(fd.value));
      } catch {}
      try {
        const ck = await window.storage.get("checkins", false);
        if (ck) setCheckins(JSON.parse(ck.value));
      } catch {}
      setLoading(false);
    })();
  }, []);

  async function persist(key, value, shared) {
    setSaving(true);
    try {
      await window.storage.set(key, JSON.stringify(value), shared);
    } catch (e) {
      console.error("Falha ao salvar", key, e);
    } finally {
      setSaving(false);
    }
  }
  async function saveProfile(next) {
    const withId = next.id ? next : { ...next, id: uid() };
    setProfile(withId);
    await persist("profile", withId, false);

    // Keep the community directory in sync with this profile
    const others = comunidade.filter((c) => c.id !== withId.id);
    let nextComunidade = others;
    if (withId.publico && withId.nome.trim()) {
      const existing = comunidade.find((c) => c.id === withId.id);
      nextComunidade = [
        ...others,
        {
          id: withId.id,
          nome: withId.nome,
          cidade: withId.cidade,
          modeloMoto: withId.modeloMoto,
          nomeMotoclube: withId.pertenceMotoclube ? withId.nomeMotoclube : "",
          seguidores: existing?.seguidores || [],
        },
      ];
    }
    setComunidade(nextComunidade);
    await persist("comunidade", nextComunidade, true);
  }
  async function saveEventos(next) {
    setEventos(next);
    await persist("eventos", next, true);
  }
  async function toggleFollow(targetId) {
    if (!profile.id) return;
    const next = comunidade.map((c) => {
      if (c.id !== targetId) return c;
      const already = c.seguidores.includes(profile.id);
      return {
        ...c,
        seguidores: already ? c.seguidores.filter((id) => id !== profile.id) : [...c.seguidores, profile.id],
      };
    });
    setComunidade(next);
    await persist("comunidade", next, true);
  }
  async function saveFeed(next) {
    setFeed(next);
    await persist("feed", next, true);
  }
  async function toggleLike(postId) {
    if (!profile.id) return;
    const next = feed.map((p) => {
      if (p.id !== postId) return p;
      const already = p.curtidas.includes(profile.id);
      return { ...p, curtidas: already ? p.curtidas.filter((id) => id !== profile.id) : [...p.curtidas, profile.id] };
    });
    setFeed(next);
    await persist("feed", next, true);
  }
  async function saveCheckins(next) {
    setCheckins(next);
    await persist("checkins", next, false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#14110E] text-[#A79A88]">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');`}</style>
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#E08A2E]" /> Carregando…
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#14110E] text-[#F3ECE1] font-[Inter]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        .disp { font-family: 'Oswald', sans-serif; letter-spacing: 0.02em; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #33291F; border-radius: 999px; }
      `}</style>

      {/* Hero header */}
      <header className="relative overflow-hidden border-b border-[#2C251C] px-6 py-10 sm:px-10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 140% at 15% 0%, rgba(224,138,46,0.14), transparent 60%), radial-gradient(60% 100% at 100% 0%, rgba(180,68,46,0.10), transparent 55%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #F3ECE1 0px, #F3ECE1 2px, transparent 2px, transparent 44px)",
          }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-[#E08A2E]">
              <Bike className="h-3.5 w-3.5" /> Comunidade &amp; estrada
            </p>
            <h1 className="disp mt-2 text-4xl font-bold uppercase leading-[0.95] text-[#F3ECE1] sm:text-6xl">
              Rota Biker
            </h1>
            <p className="mt-3 max-w-md text-sm text-[#A79A88]">
              Sua estrada, seu clube, sua garupa. Rotas e eventos num só lugar.
            </p>
          </div>

          <div className="mono flex items-center gap-2 self-start rounded-full border border-[#2C251C] bg-[#1C1712] px-3 py-1.5 text-[11px] text-[#8A7C69] sm:self-auto">
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#E08A2E]" /> salvando…
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-[#7BAE7F]" /> tudo salvo
              </>
            )}
          </div>
        </div>

        {/* Stat strip */}
        <div className="relative mt-7 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-5">
          <StatChip icon={Compass} value={MONUMENTS.length} label="monumentos" />
          <StatChip icon={Award} value={checkins.length} label="carimbos" />
          <StatChip icon={Camera} value={feed.length} label="posts" />
          <StatChip icon={Users} value={comunidade.length} label="motociclistas" />
          <StatChip icon={CalendarDays} value={eventos.length} label="eventos" />
        </div>

        {/* Tabs */}
        <nav className="relative mt-7 flex gap-1.5 overflow-x-auto pb-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition ${
                  active
                    ? "bg-[#E08A2E] text-[#14110E] shadow-[0_4px_18px_-6px_rgba(224,138,46,0.6)]"
                    : "border border-[#2C251C] text-[#A79A88] hover:border-[#3B3022] hover:text-[#F3ECE1]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        {tab === "rota" && <RotaTab />}
        {tab === "passaporte" && <PassaporteTab checkins={checkins} onSave={saveCheckins} />}
        {tab === "feed" && (
          <FeedTab feed={feed} onSave={saveFeed} onToggleLike={toggleLike} profile={profile} />
        )}
        {tab === "perfil" && <PerfilTab profile={profile} onSave={saveProfile} comunidade={comunidade} />}
        {tab === "comunidade" && (
          <ComunidadeTab comunidade={comunidade} profile={profile} onToggleFollow={toggleFollow} />
        )}
        {tab === "motoclube" && <MotoclubeTab profile={profile} onSave={saveProfile} />}
        {tab === "eventos" && <EventosTab eventos={eventos} onSave={saveEventos} profile={profile} />}
      </main>

      <footer className="border-t border-[#2C251C] px-6 py-6 text-center sm:px-10">
        <p className="mono text-[10px] uppercase tracking-[0.3em] text-[#4A4030]">
          Rota Biker · feito por quem roda
        </p>
      </footer>
    </div>
  );
}

function StatChip({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-[#2C251C] bg-[#1C1712]/80 px-3 py-2.5 backdrop-blur">
      <Icon className="h-4 w-4 text-[#E08A2E]" />
      <div>
        <div className="mono text-base font-bold leading-none text-[#F3ECE1]">{value}</div>
        <div className="mono text-[9px] uppercase tracking-[0.2em] text-[#6E6252]">{label}</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Tab: Rota (route planner)                                        */
/* ---------------------------------------------------------------- */
const ROUTE_MODES = [
  { id: "monumento", label: "Até um monumento", icon: Compass },
  { id: "personalizada", label: "Rota personalizada", icon: Route },
];

function RotaTab() {
  const [mode, setMode] = useState("monumento");

  return (
    <div>
      {/* Mode switcher */}
      <div className="mb-7 inline-flex rounded-lg border border-[#2C251C] bg-[#1A150F] p-1">
        {ROUTE_MODES.map((m) => {
          const Icon = m.icon;
          const active = m.id === mode;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                active ? "bg-[#E08A2E] text-[#14110E]" : "text-[#A79A88] hover:text-[#F3ECE1]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {m.label}
            </button>
          );
        })}
      </div>

      {mode === "monumento" ? <RotaMonumento /> : <RotaPersonalizada />}
    </div>
  );
}

function RotaMonumento() {
  const [origin, setOrigin] = useState("");
  const [selected, setSelected] = useState(MONUMENTS[0].n);
  const monument = useMemo(() => MONUMENTS.find((m) => m.n === selected), [selected]);

  const estimateKm = origin.trim()
    ? Math.round(haversineKm(BRAZIL_CENTER.lat, BRAZIL_CENTER.lng, monument.lat, monument.lng))
    : null;
  const mapsHref = origin.trim()
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.trim())}&destination=${monument.lat},${monument.lng}&travelmode=driving`
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <section className="flex flex-col gap-6">
        <Field label="01 · Ponto de saída">
          <div className="flex items-center gap-2 rounded-lg border border-[#33291F] bg-[#1C1712] px-3.5 py-3 transition focus-within:border-[#E08A2E] focus-within:ring-2 focus-within:ring-[#E08A2E]/15">
            <MapPin className="h-4 w-4 shrink-0 text-[#8A7C69]" />
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Digite sua cidade ou endereço de partida"
              className="w-full bg-transparent text-sm text-[#F3ECE1] outline-none placeholder:text-[#5C5240]"
            />
          </div>
        </Field>

        <Field label="02 · Monumento de destino">
          <select value={selected} onChange={(e) => setSelected(Number(e.target.value))} className={inputCls}>
            {MONUMENTS.map((m) => (
              <option key={m.n} value={m.n} className="bg-[#1C1712]">
                {String(m.n).padStart(2, "0")} — {m.name} ({m.city}-{m.uf})
              </option>
            ))}
          </select>
        </Field>

        <a
          href={mapsHref ?? undefined}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => !mapsHref && e.preventDefault()}
          className={`group flex items-center justify-between rounded-lg px-5 py-4 text-sm font-semibold uppercase tracking-wide transition ${
            mapsHref
              ? "bg-[#E08A2E] text-[#14110E] shadow-[0_4px_18px_-4px_rgba(224,138,46,0.55)] hover:bg-[#F0A24C]"
              : "cursor-not-allowed bg-[#26201A] text-[#5C5240]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Navigation className="h-4 w-4" /> Traçar rota até o monumento
          </span>
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </a>

        <div>
          <p className="mono mb-3 text-[11px] uppercase tracking-[0.25em] text-[#8A7C69]">Todos os monumentos</p>
          <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {MONUMENTS.map((m) => (
              <button
                key={m.n}
                onClick={() => setSelected(m.n)}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                  m.n === selected
                    ? "border-[#E08A2E] bg-[#2A2013] text-[#F3ECE1]"
                    : "border-[#2C251C] bg-[#1A150F] text-[#A79A88] hover:border-[#3B3022]"
                }`}
              >
                <span className="mono text-[#E08A2E]">{String(m.n).padStart(2, "0")}</span> {m.name}
                <div className="text-[10px] text-[#6E6252]">{m.city}-{m.uf}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Card className="h-fit p-6">
        <div className="mono text-[11px] uppercase tracking-[0.25em] text-[#E08A2E]">
          Monumento {String(monument.n).padStart(2, "0")}
        </div>
        <h2 className="disp mt-2 text-2xl font-semibold text-[#F3ECE1]">{monument.name}</h2>
        <p className="mt-1 flex items-center gap-1 text-sm text-[#A79A88]">
          <MapPin className="h-3.5 w-3.5" /> {monument.city}-{monument.uf}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[#C4B8A4]">{monument.note}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[#2C251C] bg-[#14110E] px-3 py-3">
            <div className="flex items-center gap-1 text-[#E08A2E]">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="mono text-sm font-semibold">{monument.rating.toFixed(1)}</span>
            </div>
            <p className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-[#6E6252]">avaliação</p>
          </div>
          <div className="rounded-lg border border-[#2C251C] bg-[#14110E] px-3 py-3">
            <div className="flex items-center gap-1 text-[#E08A2E]">
              <Fuel className="h-3.5 w-3.5" />
              <span className="mono text-sm font-semibold">{estimateKm ? `~${estimateKm} km` : "—"}</span>
            </div>
            <p className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-[#6E6252]">estimativa em linha reta</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function RotaPersonalizada() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const ready = origin.trim() && destination.trim();
  const mapsHref = ready
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.trim())}&destination=${encodeURIComponent(destination.trim())}&travelmode=driving`
    : null;

  return (
    <div className="mx-auto max-w-xl">
      <Card className="p-6">
        <div className="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#E08A2E]">
          <Route className="h-3.5 w-3.5" /> Rota personalizada
        </div>
        <p className="mt-2 text-sm text-[#A79A88]">
          Defina livremente o ponto de saída e o destino da sua viagem, sem precisar passar por um monumento.
        </p>

        <div className="mt-6 flex flex-col gap-5">
          <Field label="01 · Local de saída">
            <div className="flex items-center gap-2 rounded-lg border border-[#33291F] bg-[#1C1712] px-3.5 py-3 transition focus-within:border-[#E08A2E] focus-within:ring-2 focus-within:ring-[#E08A2E]/15">
              <MapPin className="h-4 w-4 shrink-0 text-[#8A7C69]" />
              <input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Cidade ou endereço de partida"
                className="w-full bg-transparent text-sm text-[#F3ECE1] outline-none placeholder:text-[#5C5240]"
              />
            </div>
          </Field>

          <Field label="02 · Destino">
            <div className="flex items-center gap-2 rounded-lg border border-[#33291F] bg-[#1C1712] px-3.5 py-3 transition focus-within:border-[#E08A2E] focus-within:ring-2 focus-within:ring-[#E08A2E]/15">
              <Navigation className="h-4 w-4 shrink-0 text-[#8A7C69]" />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Cidade, endereço ou ponto turístico"
                className="w-full bg-transparent text-sm text-[#F3ECE1] outline-none placeholder:text-[#5C5240]"
              />
            </div>
          </Field>

          <a
            href={mapsHref ?? undefined}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => !mapsHref && e.preventDefault()}
            className={`group flex items-center justify-between rounded-lg px-5 py-4 text-sm font-semibold uppercase tracking-wide transition ${
              mapsHref
                ? "bg-[#E08A2E] text-[#14110E] shadow-[0_4px_18px_-4px_rgba(224,138,46,0.55)] hover:bg-[#F0A24C]"
                : "cursor-not-allowed bg-[#26201A] text-[#5C5240]"
            }`}
          >
            <span className="flex items-center gap-2">
              <Navigation className="h-4 w-4" /> Traçar minha rota
            </span>
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
          {!ready && (
            <p className="mono -mt-2 text-[11px] text-[#6E6252]">
              Preencha saída e destino para habilitar a rota.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Tab: Perfil do motociclista                                      */
/* ---------------------------------------------------------------- */
function PerfilTab({ profile, onSave, comunidade }) {
  const [form, setForm] = useState(profile);
  useEffect(() => setForm(profile), [profile]);
  const dirty = JSON.stringify(form) !== JSON.stringify(profile);
  const seguidoresCount = comunidade.find((c) => c.id === profile.id)?.seguidores.length || 0;

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="disp text-2xl font-semibold text-[#F3ECE1]">Cadastro do motociclista</h2>
          <p className="mt-1 text-sm text-[#A79A88]">Seus dados de contato ficam só neste dispositivo.</p>
        </div>
        {seguidoresCount > 0 && (
          <div className="mono flex items-center gap-1.5 rounded-full border border-[#2C251C] bg-[#1C1712] px-3 py-1.5 text-xs text-[#E08A2E]">
            <Users className="h-3.5 w-3.5" /> {seguidoresCount} seguidores
          </div>
        )}
      </div>

      <Card className="mt-6 flex flex-col gap-5 p-6">
        <Field label="Nome completo">
          <input className={inputCls} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Seu nome" />
        </Field>
        <Field label="Cidade base">
          <input className={inputCls} value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="Cidade-UF" />
        </Field>
        <Field label="Modelo da moto">
          <input className={inputCls} value={form.modeloMoto} onChange={(e) => setForm({ ...form, modeloMoto: e.target.value })} placeholder="Ex.: Harley-Davidson Fat Boy" />
        </Field>

        <label className="flex items-center gap-3 rounded-lg border border-[#2C251C] bg-[#14110E] px-4 py-3 text-sm text-[#F3ECE1]">
          <input
            type="checkbox"
            checked={form.pertenceMotoclube}
            onChange={(e) => setForm({ ...form, pertenceMotoclube: e.target.checked })}
            className="h-4 w-4 accent-[#E08A2E]"
          />
          Eu pertenço a um motoclube
        </label>

        {form.pertenceMotoclube && (
          <Field label="Nome do motoclube">
            <input className={inputCls} value={form.nomeMotoclube} onChange={(e) => setForm({ ...form, nomeMotoclube: e.target.value })} placeholder="Nome do motoclube" />
          </Field>
        )}

        <label className="flex items-center gap-3 rounded-lg border border-[#2C251C] bg-[#14110E] px-4 py-3 text-sm text-[#F3ECE1]">
          <input
            type="checkbox"
            checked={form.publico}
            onChange={(e) => setForm({ ...form, publico: e.target.checked })}
            className="h-4 w-4 accent-[#E08A2E]"
          />
          <span>
            Exibir meu perfil na <strong>Comunidade</strong>
            <span className="mono block text-[10px] font-normal text-[#6E6252]">
              outros motociclistas poderão ver e seguir você
            </span>
          </span>
        </label>

        <PrimaryButton disabled={!dirty} onClick={() => onSave(form)}>
          <Check className="h-4 w-4" /> Salvar cadastro
        </PrimaryButton>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Tab: Motoclube (brasão)                                          */
/* ---------------------------------------------------------------- */
function MotoclubeTab({ profile, onSave }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Escolha uma imagem menor que 3MB.");
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      onSave({ ...profile, brasaoDataUrl: reader.result }).finally(() => setBusy(false));
    };
    reader.onerror = () => setBusy(false);
    reader.readAsDataURL(file);
  }
  function removeCrest() {
    onSave({ ...profile, brasaoDataUrl: null });
  }

  if (!profile.pertenceMotoclube) {
    return (
      <div className="mx-auto max-w-xl">
        <Empty icon={Shield} text={'Vá na aba Perfil e marque "Eu pertenço a um motoclube" para cadastrar o brasão.'} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="disp text-2xl font-semibold text-[#F3ECE1]">Brasão do motoclube</h2>
      <p className="mt-1 text-sm text-[#A79A88]">{profile.nomeMotoclube || "Motoclube sem nome definido"}</p>

      <Card className="mt-6 flex flex-col items-center gap-5 p-8">
        <div className="relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#33291F] bg-[#14110E]">
          {profile.brasaoDataUrl ? (
            <img src={profile.brasaoDataUrl} alt="Brasão do motoclube" className="h-full w-full object-cover" />
          ) : (
            <Shield className="h-11 w-11 text-[#33291F]" />
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#14110E]/70">
              <Loader2 className="h-6 w-6 animate-spin text-[#E08A2E]" />
            </div>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <div className="flex gap-3">
          <PrimaryButton disabled={busy} onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> {profile.brasaoDataUrl ? "Trocar imagem" : "Enviar brasão"}
          </PrimaryButton>
          {profile.brasaoDataUrl && (
            <button
              onClick={removeCrest}
              className="flex items-center gap-2 rounded-lg border border-[#33291F] px-4 py-3 text-sm text-[#C4B8A4] transition hover:border-[#B4442E] hover:text-[#E08072]"
            >
              <Trash2 className="h-4 w-4" /> Remover
            </button>
          )}
        </div>
        <p className="mono text-center text-[10px] text-[#5C5240]">PNG ou JPG, até 3MB.</p>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Tab: Eventos + lista de confirmação                              */
/* ---------------------------------------------------------------- */
function EventosTab({ eventos, onSave, profile }) {
  const [form, setForm] = useState({ titulo: "", motoclube: "", local: "", data: "", hora: "", descricao: "", flyerDataUrl: null });
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  function handleFlyerFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Escolha uma imagem menor que 3MB.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, flyerDataUrl: reader.result }));
      setUploading(false);
    };
    reader.onerror = () => setUploading(false);
    reader.readAsDataURL(file);
  }

  async function addEvento() {
    if (!form.titulo.trim() || !form.local.trim()) return;
    const novo = { id: uid(), ...form, confirmados: [], criadoEm: Date.now() };
    await onSave([novo, ...eventos]);
    setForm({ titulo: "", motoclube: "", local: "", data: "", hora: "", descricao: "", flyerDataUrl: null });
    setOpen(false);
  }
  async function removeEvento(id) {
    await onSave(eventos.filter((e) => e.id !== id));
  }
  async function toggleConfirm(id) {
    const nome = profile.nome?.trim();
    if (!nome) {
      alert("Preencha seu nome na aba Perfil antes de confirmar presença.");
      return;
    }
    const next = eventos.map((e) => {
      if (e.id !== id) return e;
      const already = e.confirmados.includes(nome);
      return { ...e, confirmados: already ? e.confirmados.filter((n) => n !== nome) : [...e.confirmados, nome] };
    });
    await onSave(next);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="disp text-2xl font-semibold text-[#F3ECE1]">Eventos</h2>
          <p className="mt-1 text-sm text-[#A79A88]">Eventos de motoclubes com lista de confirmação de presença.</p>
        </div>
        <PrimaryButton onClick={() => setOpen((o) => !o)}>
          <Plus className="h-4 w-4" /> Novo evento
        </PrimaryButton>
      </div>

      {open && (
        <Card className="mt-4 flex flex-col gap-4 p-6">
          <Field label="Título do evento">
            <input className={inputCls} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex.: Encontro Rota Biker SC" />
          </Field>
          <Field label="Motoclube organizador">
            <input className={inputCls} value={form.motoclube} onChange={(e) => setForm({ ...form, motoclube: e.target.value })} placeholder="Nome do motoclube" />
          </Field>
          <Field label="Local">
            <input className={inputCls} value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} placeholder="Endereço" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Data">
              <input type="date" className={inputCls} value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            </Field>
            <Field label="Hora">
              <input type="time" className={inputCls} value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} />
            </Field>
          </div>
          <Field label="Descrição">
            <textarea className={inputCls} rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          </Field>

          <Field label="Flyer do evento (opcional)">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFlyerFile} className="hidden" />
            {form.flyerDataUrl ? (
              <div className="relative overflow-hidden rounded-lg border border-[#33291F]">
                <img src={form.flyerDataUrl} alt="Flyer do evento" className="max-h-56 w-full object-cover" />
                <button
                  onClick={() => setForm({ ...form, flyerDataUrl: null })}
                  className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-[#14110E]/85 px-2.5 py-1.5 text-[11px] text-[#F3ECE1] backdrop-blur transition hover:text-[#E08072]"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remover
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#33291F] bg-[#14110E] py-8 text-[#8A7C69] transition hover:border-[#E08A2E] hover:text-[#E08A2E]"
              >
                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImageIcon className="h-6 w-6" />}
                <span className="mono text-[11px] uppercase tracking-[0.2em]">
                  {uploading ? "Enviando…" : "Carregar flyer (PNG ou JPG, até 3MB)"}
                </span>
              </button>
            )}
          </Field>

          <PrimaryButton onClick={addEvento}>
            <Check className="h-4 w-4" /> Publicar evento
          </PrimaryButton>
        </Card>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {eventos.length === 0 && <Empty icon={CalendarDays} text="Nenhum evento publicado ainda." />}
        {eventos.map((e) => {
          const nome = profile.nome?.trim();
          const confirmed = nome && e.confirmados.includes(nome);
          return (
            <Card key={e.id} className="overflow-hidden p-0">
              {e.flyerDataUrl && (
                <img src={e.flyerDataUrl} alt={`Flyer — ${e.titulo}`} className="max-h-64 w-full object-cover" />
              )}
              <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="disp text-lg font-semibold text-[#F3ECE1]">{e.titulo}</h3>
                  {e.motoclube && (
                    <p className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-[#E08A2E]">{e.motoclube}</p>
                  )}
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#A79A88]">
                    <MapPin className="h-3.5 w-3.5" /> {e.local}
                  </p>
                  {(e.data || e.hora) && <p className="mono mt-1 text-xs text-[#A79A88]">{e.data} {e.hora}</p>}
                </div>
                <button onClick={() => removeEvento(e.id)} className="text-[#5C5240] transition hover:text-[#E08072]">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {e.descricao && <p className="mt-3 text-sm text-[#C4B8A4]">{e.descricao}</p>}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#2C251C] pt-4">
                <div className="flex items-center gap-2 text-xs text-[#A79A88]">
                  <Users className="h-4 w-4" />
                  <span className="mono">{e.confirmados.length} confirmado(s)</span>
                </div>
                <button
                  onClick={() => toggleConfirm(e.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    confirmed
                      ? "border border-[#E08A2E] text-[#E08A2E]"
                      : "bg-[#E08A2E] text-[#14110E] shadow-[0_4px_18px_-6px_rgba(224,138,46,0.6)] hover:bg-[#F0A24C]"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" /> {confirmed ? "Presença confirmada" : "Confirmar presença"}
                </button>
              </div>

              {e.confirmados.length > 0 && (
                <div className="mono mt-3 flex flex-wrap gap-1.5 text-[10px] text-[#8A7C69]">
                  {e.confirmados.map((n) => (
                    <span key={n} className="rounded-full border border-[#2C251C] bg-[#14110E] px-2.5 py-1">
                      {n}
                    </span>
                  ))}
                </div>
              )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Tab: Comunidade (public profiles + seguir)                       */
/* ---------------------------------------------------------------- */
function ComunidadeTab({ comunidade, profile, onToggleFollow }) {
  const outros = comunidade.filter((c) => c.id !== profile.id);

  if (!profile.publico || !profile.nome?.trim()) {
    return (
      <div className="mx-auto max-w-xl">
        <Empty
          icon={Users}
          text='Ative "Exibir meu perfil na Comunidade" na aba Perfil para participar e seguir outros motociclistas.'
        />
        {outros.length > 0 && (
          <p className="mono mt-4 text-center text-[11px] text-[#6E6252]">
            {outros.length} motociclista(s) já na comunidade
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="disp text-2xl font-semibold text-[#F3ECE1]">Comunidade</h2>
      <p className="mt-1 text-sm text-[#A79A88]">Motociclistas na Rota Biker. Siga quem você já rodou junto.</p>

      <div className="mt-6 flex flex-col gap-3">
        {outros.length === 0 && <Empty icon={Users} text="Ainda não há outros motociclistas públicos por aqui." />}
        {outros.map((c) => {
          const following = c.seguidores.includes(profile.id);
          return (
            <Card key={c.id} className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2C251C] bg-[#14110E]">
                  <User className="h-5 w-5 text-[#8A7C69]" />
                </div>
                <div>
                  <h3 className="disp text-base font-semibold text-[#F3ECE1]">{c.nome}</h3>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-[#A79A88]">
                    {c.cidade && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {c.cidade}
                      </span>
                    )}
                    {c.modeloMoto && <span>{c.modeloMoto}</span>}
                  </p>
                  {c.nomeMotoclube && (
                    <p className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-[#E08A2E]">{c.nomeMotoclube}</p>
                  )}
                  <p className="mono mt-1 text-[10px] text-[#6E6252]">{c.seguidores.length} seguidores</p>
                </div>
              </div>
              <button
                onClick={() => onToggleFollow(c.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  following
                    ? "border border-[#E08A2E] text-[#E08A2E]"
                    : "bg-[#E08A2E] text-[#14110E] shadow-[0_4px_18px_-6px_rgba(224,138,46,0.6)] hover:bg-[#F0A24C]"
                }`}
              >
                {following ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                {following ? "Seguindo" : "Seguir"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Tab: Feed (posts com foto)                                       */
/* ---------------------------------------------------------------- */
function FeedTab({ feed, onSave, onToggleLike, profile }) {
  const [texto, setTexto] = useState("");
  const [fotoDataUrl, setFotoDataUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("Escolha uma imagem menor que 4MB.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setFotoDataUrl(reader.result);
      setUploading(false);
    };
    reader.onerror = () => setUploading(false);
    reader.readAsDataURL(file);
  }

  async function publicar() {
    if (!profile.nome?.trim()) {
      alert("Preencha seu nome na aba Perfil antes de publicar.");
      return;
    }
    if (!texto.trim() && !fotoDataUrl) return;
    const novo = {
      id: uid(),
      autorId: profile.id,
      autorNome: profile.nome,
      autorCidade: profile.cidade,
      texto: texto.trim(),
      fotoDataUrl,
      curtidas: [],
      criadoEm: Date.now(),
    };
    await onSave([novo, ...feed]);
    setTexto("");
    setFotoDataUrl(null);
  }

  async function remover(id) {
    await onSave(feed.filter((p) => p.id !== id));
  }

  function tempoRelativo(ts) {
    const min = Math.floor((Date.now() - ts) / 60000);
    if (min < 1) return "agora";
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} h`;
    return `${Math.floor(h / 24)} d`;
  }

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="disp text-2xl font-semibold text-[#F3ECE1]">Feed</h2>
      <p className="mt-1 text-sm text-[#A79A88]">Divida a estrada, o rolê e a moto com a comunidade.</p>

      {/* Compositor */}
      <Card className="mt-6 flex flex-col gap-4 p-5">
        <textarea
          className={inputCls}
          rows={3}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={`No que você está pensando, ${profile.nome?.trim() ? profile.nome.split(" ")[0] : "motociclista"}?`}
        />

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        {fotoDataUrl ? (
          <div className="relative overflow-hidden rounded-lg border border-[#33291F]">
            <img src={fotoDataUrl} alt="Prévia da foto" className="max-h-72 w-full object-cover" />
            <button
              onClick={() => setFotoDataUrl(null)}
              className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-[#14110E]/85 px-2.5 py-1.5 text-[11px] text-[#F3ECE1] backdrop-blur transition hover:text-[#E08072]"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-[#33291F] px-4 py-3 text-xs uppercase tracking-wide text-[#8A7C69] transition hover:border-[#E08A2E] hover:text-[#E08A2E]"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {uploading ? "Enviando…" : "Adicionar foto"}
          </button>
        )}

        <PrimaryButton disabled={!texto.trim() && !fotoDataUrl} onClick={publicar}>
          <Check className="h-4 w-4" /> Publicar
        </PrimaryButton>
      </Card>

      {/* Lista de posts */}
      <div className="mt-6 flex flex-col gap-4">
        {feed.length === 0 && <Empty icon={Camera} text="Nenhum post ainda. Seja o primeiro a compartilhar a estrada." />}
        {feed.map((p) => {
          const liked = profile.id && p.curtidas.includes(profile.id);
          const mine = p.autorId === profile.id;
          return (
            <Card key={p.id} className="overflow-hidden p-0">
              <div className="flex items-start justify-between gap-3 p-5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2C251C] bg-[#14110E]">
                    <User className="h-4.5 w-4.5 text-[#8A7C69]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F3ECE1]">{p.autorNome}</p>
                    <p className="mono text-[10px] text-[#6E6252]">
                      {p.autorCidade ? `${p.autorCidade} · ` : ""}
                      {tempoRelativo(p.criadoEm)}
                    </p>
                  </div>
                </div>
                {mine && (
                  <button onClick={() => remover(p.id)} className="text-[#5C5240] transition hover:text-[#E08072]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {p.texto && <p className="px-5 pb-3 text-sm leading-relaxed text-[#C4B8A4]">{p.texto}</p>}
              {p.fotoDataUrl && <img src={p.fotoDataUrl} alt="Foto do post" className="max-h-96 w-full object-cover" />}

              <div className="flex items-center gap-2 border-t border-[#2C251C] px-5 py-3">
                <button
                  onClick={() => onToggleLike(p.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                    liked ? "text-[#E08A2E]" : "text-[#8A7C69] hover:text-[#E08A2E]"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  {p.curtidas.length > 0 ? p.curtidas.length : "Curtir"}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Tab: Passaporte (check-in por geolocalização)                    */
/* ---------------------------------------------------------------- */
const CHECKIN_RADIUS_KM = 15; // tolerância, já que as coordenadas de alguns pontos são aproximadas

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Seu navegador não suporta geolocalização."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 30000,
    });
  });
}

function PassaporteTab({ checkins, onSave }) {
  const [status, setStatus] = useState("idle"); // idle | locating | success | far | error
  const [message, setMessage] = useState("");

  const visitedIds = new Set(checkins.map((c) => c.monumentId));

  async function fazerCheckin() {
    setStatus("locating");
    setMessage("");
    try {
      const pos = await getPosition();
      const { latitude, longitude } = pos.coords;

      let nearest = null;
      let nearestKm = Infinity;
      for (const m of MONUMENTS) {
        const km = haversineKm(latitude, longitude, m.lat, m.lng);
        if (km < nearestKm) {
          nearestKm = km;
          nearest = m;
        }
      }

      if (nearestKm <= CHECKIN_RADIUS_KM) {
        if (visitedIds.has(nearest.n)) {
          setStatus("success");
          setMessage(`Você já tinha carimbado "${nearest.name}" (${nearest.city}-${nearest.uf}).`);
        } else {
          const novo = { monumentId: nearest.n, ts: Date.now(), km: Math.round(nearestKm * 10) / 10 };
          await onSave([...checkins, novo]);
          setStatus("success");
          setMessage(`Carimbo novo: "${nearest.name}" (${nearest.city}-${nearest.uf})!`);
        }
      } else {
        setStatus("far");
        setMessage(
          `Você está a ~${Math.round(nearestKm)} km do ponto mais próximo, "${nearest.name}" (${nearest.city}-${nearest.uf}). Chegue mais perto para carimbar.`
        );
      }
    } catch (err) {
      setStatus("error");
      if (err.code === 1) setMessage("Permissão de localização negada. Ative-a nas configurações do navegador.");
      else setMessage(err.message || "Não foi possível obter sua localização.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="disp text-2xl font-semibold text-[#F3ECE1]">Passaporte Biker</h2>
          <p className="mt-1 text-sm text-[#A79A88]">
            {checkins.length} de {MONUMENTS.length} monumentos carimbados
          </p>
        </div>
        <PrimaryButton onClick={fazerCheckin} disabled={status === "locating"}>
          {status === "locating" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
          {status === "locating" ? "Localizando…" : "Fazer check-in"}
        </PrimaryButton>
      </div>

      {message && (
        <Card
          className={`mt-4 p-4 text-sm ${
            status === "success" ? "border-[#7BAE7F]/40 text-[#B7D8B9]" : status === "far" ? "text-[#C4B8A4]" : "border-[#B4442E]/40 text-[#E08072]"
          }`}
        >
          {message}
        </Card>
      )}

      <p className="mono mt-6 text-[10px] uppercase tracking-[0.2em] text-[#6E6252]">
        O check-in usa a localização do seu dispositivo — o navegador vai pedir permissão.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MONUMENTS.map((m) => {
          const visited = visitedIds.has(m.n);
          const checkin = checkins.find((c) => c.monumentId === m.n);
          return (
            <Card
              key={m.n}
              className={`flex flex-col items-center gap-2 p-4 text-center ${
                visited ? "border-[#E08A2E]/50 bg-[#241C12]" : "opacity-60"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                  visited ? "border-[#E08A2E] text-[#E08A2E]" : "border-[#33291F] text-[#33291F]"
                }`}
              >
                {visited ? <Award className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
              </div>
              <p className="disp text-xs font-semibold leading-tight text-[#F3ECE1]">{m.name}</p>
              <p className="mono text-[9px] text-[#6E6252]">{m.city}-{m.uf}</p>
              {visited && checkin && (
                <p className="mono text-[9px] text-[#E08A2E]">
                  {new Date(checkin.ts).toLocaleDateString("pt-BR")}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
