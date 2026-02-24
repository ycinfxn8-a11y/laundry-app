<template>
  <div class="login-page">

    <!-- Hero Section -->
    <div class="login-hero">
      <div class="login-hero__bubbles">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="login-hero__content">
        <p class="login-hero__label">Selamat datang</p>
        <h1 class="login-hero__title">🧺 Laundry App</h1>
        <p class="login-hero__tagline">Bersih, Wangi &<br>Tepat Waktu</p>
        <p class="login-hero__desc">
          Kami menjemput, mencuci, dan mengantarkan pakaian kamu kembali dalam kondisi terbaik.
        </p>
        <button @click="handleLogin" :disabled="loading">
          <span v-if="loading">Memproses...</span>
          <span v-else>Masuk dengan Google</span>
        </button>
      </div>
    </div>

    <!-- Keunggulan -->
    <div class="login-section">
      <h3 class="login-section__title">Mengapa Pilih Kami?</h3>
      <div class="login-features">
        <div class="login-feature" v-for="f in features" :key="f.icon">
          <span class="login-feature__icon">{{ f.icon }}</span>
          <div>
            <strong>{{ f.title }}</strong>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Layanan -->
    <div class="login-section">
      <h3 class="login-section__title">Layanan Kami</h3>
      <div class="login-service-list">
        <div class="login-service-row" v-for="s in services" :key="s.name">
          <div class="login-service-row__left">
            <span>{{ s.icon }}</span>
            <div>
              <strong>{{ s.name }}</strong>
              <p>{{ s.desc }}</p>
            </div>
          </div>
          <span class="login-service-row__price">Rp {{ s.price.toLocaleString('id-ID') }}/kg</span>
        </div>
      </div>
    </div>

    <!-- Cara Pesan -->
    <div class="login-section">
      <h3 class="login-section__title">Cara Pesan</h3>
      <div class="login-steps">
        <div class="login-step" v-for="(step, i) in steps" :key="i">
          <div class="login-step__number">{{ i + 1 }}</div>
          <div class="login-step__content">
            <strong>{{ step.title }}</strong>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Operasional -->
    <div class="login-section">
      <h3 class="login-section__title">Informasi</h3>
      <div class="login-info-card">
        <div class="login-info-row" v-for="info in operationalInfo" :key="info.label">
          <span>{{ info.label }}</span>
          <span>{{ info.value }}</span>
        </div>
      </div>
    </div>

    <!-- CTA Bottom -->
    <div class="login-cta">
      <p>Siap mulai laundry lebih mudah?</p>
      <button @click="handleLogin" :disabled="loading" class="login-cta__btn">
        {{ loading ? 'Memproses...' : 'Masuk Sekarang' }}
      </button>
    </div>

    <!-- Footer -->
    <div class="login-footer">
      <p>© 2025 Laundry App · Dibuat dengan ❤️</p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    await auth.loginWithGoogle()
    router.push('/')
  } finally {
    loading.value = false
  }
}

const features = [
  { icon: '🫧', title: 'Bersih Maksimal', desc: 'Deterjen premium untuk hasil terbaik' },
  { icon: '🚗', title: 'Jemput & Antar', desc: 'Tidak perlu keluar rumah' },
  { icon: '🔔', title: 'Notifikasi Real-time', desc: 'Update status langsung ke HP kamu' },
  { icon: '⚡', title: 'Cepat & Tepat', desc: 'Selesai dalam 1–2 hari kerja' },
]

const services = [
  { icon: '🫧', name: 'Cuci', desc: 'Cuci bersih dengan mesin modern', price: 7000 },
  { icon: '👕', name: 'Cuci + Setrika', desc: 'Cuci bersih dan rapi siap pakai', price: 10000 },
  { icon: '🔥', name: 'Setrika', desc: 'Setrika rapi tanpa cuci', price: 5000 },
  { icon: '✨', name: 'Dry Clean', desc: 'Untuk pakaian berbahan khusus', price: 25000 },
]

const steps = [
  { title: 'Buat Pesanan', desc: 'Pilih layanan dan metode pengambilan lewat aplikasi' },
  { title: 'Jemput atau Antar', desc: 'Kami jemput ke lokasi kamu, atau kamu antar langsung' },
  { title: 'Proses Laundry', desc: 'Pakaian dicuci dan disetrika dengan standar terbaik' },
  { title: 'Terima Notifikasi', desc: 'Kamu diberitahu saat laundry selesai dan siap diambil' },
]

const operationalInfo = [
  { label: '🕗 Jam Operasional', value: '07.00 – 21.00' },
  { label: '📅 Hari Operasional', value: 'Senin – Sabtu' },
  { label: '⏱ Estimasi Selesai', value: '1 – 2 hari kerja' },
  { label: '🚗 Jangkauan Jemput', value: 'Radius 5 km' },
  { label: '💳 Pembayaran', value: 'Tunai / Transfer' },
]
</script>

<style scoped>
.login-page {
  background: var(--foam-100);
  min-height: 100vh;
  padding-bottom: 2rem;
  animation: fadeUp .35s ease both;
}

/* Hero */
.login-hero {
  background: linear-gradient(135deg, var(--teal-900) 0%, var(--teal-500) 100%);
  padding: 3rem 1.5rem 2.5rem;
  position: relative;
  overflow: hidden;
}
.login-hero__bubbles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.login-hero__bubbles span {
  display: block;
  border-radius: 50%;
  background: rgba(255,255,255,.07);
  position: absolute;
}
.login-hero__bubbles span:nth-child(1) { width: 140px; height: 140px; top: -40px; right: -40px; }
.login-hero__bubbles span:nth-child(2) { width: 80px;  height: 80px;  top: 80px;  right: 30px; }
.login-hero__bubbles span:nth-child(3) { width: 50px;  height: 50px;  bottom: 20px; left: -10px; }
.login-hero__bubbles span:nth-child(4) { width: 30px;  height: 30px;  bottom: 60px; left: 60px; }

.login-hero__content { position: relative; z-index: 1; }

.login-hero__label {
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--teal-100);
  margin-bottom: .5rem;
}
.login-hero__title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--white);
  margin-bottom: .5rem;
  line-height: 1.1;
}
.login-hero__tagline {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--teal-100);
  margin-bottom: .75rem;
  line-height: 1.3;
}
.login-hero__desc {
  font-size: .875rem;
  color: rgba(255,255,255,.75);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 280px;
}
.login-hero button {
  background: var(--white);
  color: var(--teal-700);
  padding: .95rem 2rem;
  border-radius: var(--radius-xl);
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-display);
  border: none;
  cursor: pointer;
  transition: all var(--transition);
  box-shadow: 0 8px 24px rgba(0,0,0,.2);
  width: 100%;
}
.login-hero button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0,0,0,.25);
}
.login-hero button:disabled {
  opacity: .6;
  cursor: not-allowed;
}

/* Sections */
.login-section {
  padding: 1.5rem 1.25rem 0;
}
.login-section__title {
  font-family: var(--font-display);
  font-size: .95rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: .85rem;
}

/* Features */
.login-features {
  display: flex;
  flex-direction: column;
  gap: .6rem;
}
.login-feature {
  display: flex;
  align-items: flex-start;
  gap: .85rem;
  background: var(--white);
  border: 1.5px solid var(--neutral-100);
  border-radius: var(--radius-md);
  padding: .9rem 1rem;
  transition: all var(--transition);
}
.login-feature:hover {
  border-color: var(--teal-300);
  background: var(--teal-50);
}
.login-feature__icon { font-size: 1.4rem; flex-shrink: 0; }
.login-feature strong {
  display: block;
  font-size: .875rem;
  color: var(--neutral-900);
  margin-bottom: .15rem;
}
.login-feature p {
  font-size: .78rem;
  color: var(--neutral-500);
  margin: 0;
  line-height: 1.4;
}

/* Service List */
.login-service-list {
  background: var(--white);
  border: 1.5px solid var(--neutral-100);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.login-service-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .9rem 1rem;
  border-bottom: 1px solid var(--neutral-100);
  gap: .75rem;
}
.login-service-row:last-child { border-bottom: none; }
.login-service-row__left {
  display: flex;
  align-items: center;
  gap: .75rem;
}
.login-service-row__left span:first-child { font-size: 1.2rem; }
.login-service-row__left strong {
  display: block;
  font-size: .875rem;
  color: var(--neutral-900);
}
.login-service-row__left p {
  font-size: .775rem;
  color: var(--neutral-500);
  margin: 0;
}
.login-service-row__price {
  font-family: var(--font-display);
  font-size: .825rem;
  font-weight: 700;
  color: var(--teal-700);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Steps */
.login-steps {
  position: relative;
}
.login-steps::before {
  content: '';
  position: absolute;
  left: 1.1rem;
  top: 1.5rem;
  bottom: 1.5rem;
  width: 2px;
  background: linear-gradient(to bottom, var(--teal-400), var(--teal-100));
  border-radius: 99px;
}
.login-step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: .6rem 0;
  position: relative;
}
.login-step__number {
  width: 2.2rem;
  height: 2.2rem;
  background: var(--teal-500);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: .875rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 0 4px var(--foam-100);
}
.login-step__content {
  padding-top: .2rem;
  padding-bottom: .75rem;
}
.login-step__content strong {
  display: block;
  font-size: .9rem;
  color: var(--neutral-900);
  margin-bottom: .15rem;
}
.login-step__content p {
  font-size: .8rem;
  color: var(--neutral-500);
  line-height: 1.5;
}

/* Info Card */
.login-info-card {
  background: var(--white);
  border: 1.5px solid var(--neutral-100);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.login-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .8rem 1rem;
  border-bottom: 1px solid var(--neutral-100);
  font-size: .875rem;
}
.login-info-row:last-child { border-bottom: none; }
.login-info-row span:first-child { color: var(--neutral-700); }
.login-info-row span:last-child {
  font-weight: 600;
  color: var(--neutral-900);
  font-family: var(--font-display);
  font-size: .825rem;
}

/* CTA Bottom */
.login-cta {
  margin: 1.75rem 1.25rem 0;
  background: linear-gradient(135deg, var(--teal-900), var(--teal-600, var(--teal-500)));
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  text-align: center;
}
.login-cta p {
  color: var(--teal-100);
  font-size: .9rem;
  margin-bottom: 1rem;
}
.login-cta__btn {
  background: var(--white);
  color: var(--teal-700);
  padding: .9rem 2rem;
  border-radius: var(--radius-lg);
  font-size: .95rem;
  font-weight: 700;
  font-family: var(--font-display);
  border: none;
  cursor: pointer;
  transition: all var(--transition);
  width: 100%;
  box-shadow: 0 4px 14px rgba(0,0,0,.15);
}
.login-cta__btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0,0,0,.2);
}
.login-cta__btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}

/* Footer */
.login-footer {
  margin-top: 2rem;
  padding: 1.25rem;
  text-align: center;
  border-top: 1px solid var(--neutral-100);
}
.login-footer p {
  font-size: .78rem;
  color: var(--neutral-300);
}
</style>