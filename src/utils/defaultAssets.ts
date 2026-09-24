import { Asset } from '../types';

function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const DEFAULT_ASSETS: Asset[] = [
  {
    id: 'A001',
    projectId: 'proj_default',
    name: 'character_presenter.svg',
    type: 'image/svg+xml',
    width: 320,
    height: 480,
    sizeBytes: 14200,
    createdAt: new Date().toISOString(),
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480" width="320" height="480">
        <defs>
          <linearGradient id="charSuit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E3A8A"/>
            <stop offset="100%" stop-color="#1D4ED8"/>
          </linearGradient>
          <linearGradient id="charSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FCD34D"/>
            <stop offset="100%" stop-color="#F59E0B"/>
          </linearGradient>
        </defs>
        <!-- Body / Suit -->
        <rect x="90" y="160" width="140" height="180" rx="28" fill="url(#charSuit)"/>
        <!-- White Collar -->
        <polygon points="160,200 130,160 190,160" fill="#FFFFFF"/>
        <polygon points="155,160 160,240 165,160" fill="#3B82F6"/>
        <!-- Head -->
        <circle cx="160" cy="95" r="48" fill="url(#charSkin)"/>
        <!-- Hair -->
        <path d="M112,85 C112,45 208,45 208,85 C208,85 195,65 160,65 C125,65 112,85 112,85 Z" fill="#1E293B"/>
        <!-- Eyes & Smile -->
        <circle cx="145" cy="95" r="4" fill="#0F172A"/>
        <circle cx="175" cy="95" r="4" fill="#0F172A"/>
        <path d="M150,112 Q160,122 170,112" stroke="#0F172A" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Presenting Arm / Hand -->
        <path d="M90,190 Q40,220 50,260" stroke="#1D4ED8" stroke-width="26" stroke-linecap="round" fill="none"/>
        <circle cx="50" cy="265" r="14" fill="url(#charSkin)"/>
        <!-- Left Arm -->
        <path d="M230,190 Q270,220 260,260" stroke="#1D4ED8" stroke-width="26" stroke-linecap="round" fill="none"/>
        <circle cx="260" cy="265" r="14" fill="url(#charSkin)"/>
        <!-- Legs -->
        <rect x="115" y="340" width="36" height="110" rx="10" fill="#1E293B"/>
        <rect x="169" y="340" width="36" height="110" rx="10" fill="#1E293B"/>
        <!-- Shoes -->
        <path d="M100,450 L155,450 C155,465 100,465 100,450 Z" fill="#0F172A"/>
        <path d="M165,450 L220,450 C220,465 165,465 165,450 Z" fill="#0F172A"/>
      </svg>
    `),
  },
  {
    id: 'A002',
    projectId: 'proj_default',
    name: 'fintech_laptop.svg',
    type: 'image/svg+xml',
    width: 440,
    height: 300,
    sizeBytes: 12100,
    createdAt: new Date().toISOString(),
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 300" width="440" height="300">
        <defs>
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="100%" stop-color="#1E293B"/>
          </linearGradient>
          <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <!-- Screen Bezel -->
        <rect x="50" y="30" width="340" height="210" rx="12" fill="#334155" stroke="#64748B" stroke-width="2"/>
        <!-- Screen Content -->
        <rect x="62" y="42" width="316" height="186" rx="6" fill="url(#screenGrad)"/>
        <!-- Camera -->
        <circle cx="220" cy="36" r="2.5" fill="#94A3B8"/>
        <!-- Dashboard Top Bar -->
        <rect x="74" y="54" width="292" height="18" rx="4" fill="#1E293B"/>
        <circle cx="84" cy="63" r="3" fill="#EF4444"/>
        <circle cx="94" cy="63" r="3" fill="#F59E0B"/>
        <circle cx="104" cy="63" r="3" fill="#10B981"/>
        <rect x="130" y="60" width="80" height="6" rx="3" fill="#3B82F6"/>
        <!-- Mini Metric Cards -->
        <rect x="74" y="80" width="90" height="42" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
        <rect x="82" y="88" width="40" height="5" rx="2" fill="#94A3B8"/>
        <rect x="82" y="99" width="60" height="12" rx="3" fill="#60A5FA"/>
        <rect x="174" y="80" width="90" height="42" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
        <rect x="182" y="88" width="45" height="5" rx="2" fill="#94A3B8"/>
        <rect x="182" y="99" width="55" height="12" rx="3" fill="#34D399"/>
        <rect x="274" y="80" width="92" height="42" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
        <rect x="282" y="88" width="45" height="5" rx="2" fill="#94A3B8"/>
        <rect x="282" y="99" width="65" height="12" rx="3" fill="#A78BFA"/>
        <!-- Chart Area -->
        <path d="M74,195 L110,165 L150,180 L200,145 L250,160 L300,135 L366,150 L366,205 L74,205 Z" fill="url(#chartGrad)"/>
        <path d="M74,195 L110,165 L150,180 L200,145 L250,160 L300,135 L366,150" stroke="#60A5FA" stroke-width="3" fill="none"/>
        <!-- Laptop Base -->
        <path d="M20,240 L420,240 L395,258 L45,258 Z" fill="#94A3B8"/>
        <rect x="185" y="240" width="70" height="6" rx="3" fill="#64748B"/>
        <rect x="15" y="258" width="410" height="5" rx="2.5" fill="#64748B"/>
      </svg>
    `),
  },
  {
    id: 'A003',
    projectId: 'proj_default',
    name: 'banking_phone.svg',
    type: 'image/svg+xml',
    width: 240,
    height: 440,
    sizeBytes: 9800,
    createdAt: new Date().toISOString(),
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 440" width="240" height="440">
        <defs>
          <linearGradient id="phoneBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E293B"/>
            <stop offset="100%" stop-color="#0F172A"/>
          </linearGradient>
          <linearGradient id="balanceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1D4ED8"/>
            <stop offset="100%" stop-color="#3B82F6"/>
          </linearGradient>
        </defs>
        <!-- Phone Case -->
        <rect x="10" y="10" width="220" height="420" rx="36" fill="url(#phoneBody)" stroke="#475569" stroke-width="4"/>
        <!-- Screen -->
        <rect x="18" y="20" width="204" height="400" rx="28" fill="#FFFFFF"/>
        <!-- Speaker Notch / Dynamic Island -->
        <rect x="85" y="28" width="70" height="16" rx="8" fill="#0F172A"/>
        <circle cx="142" cy="36" r="3" fill="#1E293B"/>
        <!-- App Header -->
        <rect x="32" y="60" width="30" height="30" rx="8" fill="#EFF6FF"/>
        <circle cx="47" cy="75" r="8" fill="#2563EB"/>
        <rect x="72" y="65" width="80" height="8" rx="4" fill="#0F172A"/>
        <rect x="72" y="77" width="50" height="6" rx="3" fill="#94A3B8"/>
        <!-- Balance Card -->
        <rect x="32" y="105" width="176" height="110" rx="16" fill="url(#balanceGrad)"/>
        <text x="48" y="132" fill="#BFDBFE" font-family="sans-serif" font-size="11" font-weight="500">Total Savings</text>
        <text x="48" y="165" fill="#FFFFFF" font-family="sans-serif" font-size="22" font-weight="700">$48,920.50</text>
        <rect x="48" y="182" width="60" height="16" rx="8" fill="#FFFFFF" fill-opacity="0.2"/>
        <text x="56" y="194" fill="#FFFFFF" font-family="sans-serif" font-size="9" font-weight="600">+12.4% / mo</text>
        <!-- Quick Action Buttons -->
        <circle cx="62" cy="245" r="20" fill="#EFF6FF"/>
        <circle cx="120" cy="245" r="20" fill="#EFF6FF"/>
        <circle cx="178" cy="245" r="20" fill="#EFF6FF"/>
        <polygon points="62,238 68,248 56,248" fill="#2563EB"/>
        <polygon points="120,252 114,242 126,242" fill="#2563EB"/>
        <rect x="171" y="241" width="14" height="8" rx="2" fill="#2563EB"/>
        <!-- Recent Activity Rows -->
        <rect x="32" y="285" width="176" height="36" rx="8" fill="#F8FAFC"/>
        <circle cx="48" cy="303" r="10" fill="#DBEAFE"/>
        <rect x="66" y="296" width="65" height="7" rx="3" fill="#334155"/>
        <rect x="66" y="306" width="40" height="5" rx="2" fill="#94A3B8"/>
        <text x="175" y="306" fill="#16A34A" font-family="sans-serif" font-size="10" font-weight="600">+$850</text>
        <!-- Home Indicator -->
        <rect x="85" y="410" width="70" height="4" rx="2" fill="#CBD5E1"/>
      </svg>
    `),
  },
  {
    id: 'A004',
    projectId: 'proj_default',
    name: 'platinum_card.svg',
    type: 'image/svg+xml',
    width: 360,
    height: 226,
    sizeBytes: 8400,
    createdAt: new Date().toISOString(),
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 226" width="360" height="226">
        <defs>
          <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E3A8A"/>
            <stop offset="50%" stop-color="#2563EB"/>
            <stop offset="100%" stop-color="#1D4ED8"/>
          </linearGradient>
          <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FCD34D"/>
            <stop offset="100%" stop-color="#D97706"/>
          </linearGradient>
        </defs>
        <!-- Card Body -->
        <rect x="0" y="0" width="360" height="226" rx="20" fill="url(#cardBg)"/>
        <!-- Background Pattern -->
        <circle cx="280" cy="113" r="120" fill="#FFFFFF" fill-opacity="0.06"/>
        <circle cx="340" cy="50" r="80" fill="#FFFFFF" fill-opacity="0.05"/>
        <!-- EMV Chip -->
        <rect x="40" y="46" width="48" height="38" rx="6" fill="url(#chipGrad)" stroke="#B45309" stroke-width="1.5"/>
        <line x1="40" y1="65" x2="88" y2="65" stroke="#B45309" stroke-width="1"/>
        <line x1="64" y1="46" x2="64" y2="84" stroke="#B45309" stroke-width="1"/>
        <!-- Contactless Icon -->
        <path d="M106,56 A12,12 0 0,1 106,74 M113,51 A18,18 0 0,1 113,79 M120,46 A24,24 0 0,1 120,84" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8"/>
        <!-- Brand Name -->
        <text x="250" y="55" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="700" letter-spacing="1">BLUEPAY</text>
        <text x="40" y="145" fill="#FFFFFF" font-family="monospace" font-size="18" font-weight="600" letter-spacing="3">4921  8834  1029  6652</text>
        <!-- Holder & Expiry -->
        <text x="40" y="175" fill="#93C5FD" font-family="sans-serif" font-size="9" font-weight="500">CARDHOLDER</text>
        <text x="40" y="195" fill="#FFFFFF" font-family="sans-serif" font-size="13" font-weight="600">ALEXANDRA CHEN</text>
        <text x="210" y="175" fill="#93C5FD" font-family="sans-serif" font-size="9" font-weight="500">EXPIRES</text>
        <text x="210" y="195" fill="#FFFFFF" font-family="sans-serif" font-size="13" font-weight="600">09/29</text>
      </svg>
    `),
  },
  {
    id: 'A005',
    projectId: 'proj_default',
    name: 'security_shield.svg',
    type: 'image/svg+xml',
    width: 280,
    height: 320,
    sizeBytes: 7600,
    createdAt: new Date().toISOString(),
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 320" width="280" height="320">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563EB"/>
            <stop offset="100%" stop-color="#1E3A8A"/>
          </linearGradient>
          <linearGradient id="innerShield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3B82F6"/>
            <stop offset="100%" stop-color="#1D4ED8"/>
          </linearGradient>
        </defs>
        <!-- Outer Shield -->
        <path d="M140,20 L240,65 C240,180 170,265 140,295 C110,265 40,180 40,65 Z" fill="url(#shieldGrad)" filter="drop-shadow(0 8px 16px rgba(30,58,138,0.25))"/>
        <!-- Inner Border Line -->
        <path d="M140,36 L224,74 C224,170 166,245 140,272 C114,245 56,170 56,74 Z" fill="url(#innerShield)" opacity="0.9"/>
        <!-- Keyhole / Checkmark -->
        <circle cx="140" cy="130" r="22" fill="#FFFFFF"/>
        <polygon points="140,130 130,175 150,175" fill="#FFFFFF"/>
        <!-- Success Pulse Checkmark -->
        <circle cx="140" cy="205" r="14" fill="#10B981"/>
        <polyline points="134,205 138,209 146,201" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'A006',
    projectId: 'proj_default',
    name: 'transfer_badge.svg',
    type: 'image/svg+xml',
    width: 320,
    height: 120,
    sizeBytes: 6200,
    createdAt: new Date().toISOString(),
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" width="320" height="120">
        <defs>
          <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="100%" stop-color="#F8FAFC"/>
          </linearGradient>
        </defs>
        <!-- Container Box -->
        <rect x="10" y="10" width="300" height="100" rx="20" fill="url(#badgeGrad)" stroke="#2563EB" stroke-width="2" filter="drop-shadow(0 4px 12px rgba(37,99,235,0.12))"/>
        <!-- Success Icon -->
        <circle cx="55" cy="60" r="24" fill="#EFF6FF"/>
        <circle cx="55" cy="60" r="18" fill="#10B981"/>
        <polyline points="48,60 53,65 62,55" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <!-- Text -->
        <text x="92" y="52" fill="#0F172A" font-family="sans-serif" font-size="15" font-weight="700">Instant Transfer Confirmed</text>
        <text x="92" y="74" fill="#2563EB" font-family="sans-serif" font-size="18" font-weight="700">+$1,250.00 USD</text>
      </svg>
    `),
  },
];
