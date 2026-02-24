<template>
  <div class="home-page">

    <!-- Header -->
    <div class="home-header">
      <div class="home-header__text">
        <p class="home-header__greeting">Halo, {{ firstName }} 👋</p>
        <h2 class="home-header__title">Mau laundry<br>hari ini?</h2>
      </div>
      <button class="home-header__logout" @click="handleLogout">Keluar</button>
    </div>

    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="hero-banner__bubbles">
        <span></span><span></span><span></span>
      </div>
      <p class="hero-banner__label">Layanan terpercaya</p>
      <h3 class="hero-banner__title">Bersih, Wangi &<br>Tepat Waktu</h3>
      <p class="hero-banner__desc">
        Kami menjemput, mencuci, dan mengantarkan pakaian kamu kembali dalam kondisi terbaik.
      </p>
    </div>

    <!-- Aksi Utama -->
    <div class="home-actions">
      <router-link to="/order" class="btn-primary">
        🧺 Buat Pesanan
      </router-link>
      <router-link to="/history" class="btn-secondary">
        📋 Riwayat Pesanan
      </router-link>
    </div>

    <!-- Pesanan Terakhir -->
    <div v-if="latestOrder" class="latest-order">
      <h3 class="section-title">Pesanan Terakhir</h3>
      <div class="order-card">
        <div class="order-header">
          <span class="order-id">#{{ latestOrder.id.slice(0, 6).toUpperCase() }}</span>
          <span :class="['status', latestOrder.status]">{{ statusLabel[latestOrder.status] }}</span>
        </div>
        <p>{{ serviceNames(latestOrder.services) }} · ~{{ latestOrder.weight }} kg</p>
        <router-link to="/history">Lihat semua pesanan →</router-link>
      </div>
    </div>

    <!-- Keunggulan -->
    <div class="features">
      <h3 class="section-title">Mengapa Pilih Kami?</h3>
      <div class="features-grid">
        <div class="feature-card" v-for="f in features" :key="f.icon">
          <span class="feature-card__icon">{{ f.icon }}</span>
          <strong>{{ f.title }}</strong>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Layanan -->
    <div class="services-info">
      <h3 class="section-title">Layanan Kami</h3>
      <div class="service-list">
        <div class="service-row" v-for="s in services" :key="s.name">
          <div class="service-row__left">
            <span>{{ s.icon }}</span>
            <div>
              <strong>{{ s.name }}</strong>
              <p>{{ s.desc }}</p>
            </div>
          </div>
          <span class="service-row__price">Rp {{ s.price.toLocaleString('id-ID') }}/kg</span>
        </div>
      </div>
    </div>

    <!-- Cara Kerja -->
    <div class="how-it-works">
      <h3 class="section-title">Cara Pesan</h3>
      <div class="steps">
        <div class="step" v-for="(step, i) in steps" :key="i">
          <div class="step__number">{{ i + 1 }}</div>
          <div class="step__content">
            <strong>{{ step.title }}</strong>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Jam Operasional -->
    <div class="operational-info">
      <h3 class="section-title">Informasi</h3>
      <div class="info-card">
        <div class="info-row">
          <span>🕗 Jam Operasional</span>
          <span>07.00 – 21.00</span>
        </div>
        <div class="info-row">
          <span>📅 Hari Operasional</span>
          <span>Senin – Sabtu</span>
        </div>
        <div class="info-row">
          <span>⏱ Estimasi Selesai</span>
          <span>1 – 2 hari kerja</span>
        </div>
        <div class="info-row">
          <span>🚗 Jangkauan Jemput</span>
          <span>Radius 5 km</span>
        </div>
        <div class="info-row">
          <span>💳 Pembayaran</span>
          <span>Tunai / Transfer</span>
        </div>
      </div>
    </div>

    <!-- Admin Link -->
    <div v-if="isAdmin" class="admin-link">
      <router-link to="/admin">🔧 Buka Dashboard Admin</router-link>
    </div>

    <!-- Footer -->
    <div class="home-footer">
      <p>© 2025 Laundry App · Dibuat dengan ❤️</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useOrderStore } from '../stores/order'
import { storeToRefs } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const router = useRouter()
const authStore = useAuthStore()
const orderStore = useOrderStore()
const { user } = storeToRefs(authStore)
const isAdmin = ref(false)

const firstName = computed(() =>
  user.value?.displayName?.split(' ')[0] || 'Kamu'
)

onMounted(async () => {
  orderStore.fetchOrders()
  if (user.value) {
    const userDoc = await getDoc(doc(db, 'users', user.value.uid))
    isAdmin.value = userDoc.data()?.role === 'admin'
  }
})

const latestOrder = computed(() =>
  orderStore.orders.length ? orderStore.orders[0] : null
)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

const statusLabel = {
  pending:    '⏳ Menunggu',
  confirmed:  '✅ Dikonfirmasi',
  picked_up:  '🚗 Dijemput',
  processing: '🫧 Diproses',
  done:       '✨ Selesai',
  delivered:  '📦 Diantar'
}

function serviceNames(services) {
  const map = {
    wash: 'Cuci', wash_iron: 'Cuci + Setrika',
    iron: 'Setrika', dry_clean: 'Dry Clean'
  }
  return services?.map(s => map[s]).join(', ') || '-'
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
</script>

<style scoped>
.home-page {
  padding-bottom: 2rem;
  animation: fadeUp .35s ease both;
}

/* Header */
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.25rem 0;
}
.home-header__greeting {
  font-size: .85rem;
  color: var(--neutral-500);
  margin-bottom: .15rem;
}
.home-header__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}
.home-header__logout {
  font-size: .78rem;
  color: var(--neutral-500);
  padding: .4rem .75rem;
  background: var(--neutral-100);
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  transition: all var(--transition);
  margin-top: .2rem;
}
.home-header__logout:hover {
  background: var(--neutral-900);
  color: var(--white);
}

/* Hero Banner */
.hero-banner {
  margin: 1.25rem 1.25rem 0;
  background: linear-gradient(135deg, var(--teal-900) 0%, var(--teal-500) 100%);
  border-radius: var(--radius-xl);
  padding: 1.75rem 1.5rem;
  position: relative;
  overflow: hidden;
}
.hero-banner__bubbles {
  position: absolute;
  top: -20px;
  right: -20px;
  pointer-events: none;
}
.hero-banner__bubbles span {
  display: block;
  border-radius: 50%;
  background: rgba(255,255,255,.07);
  position: absolute;
}
.hero-banner__bubbles span:nth-child(1) {
  width: 100px; height: 100px;
  top: 0; right: 0;
}
.hero-banner__bubbles span:nth-child(2) {
  width: 60px; height: 60px;
  top: 60px; right: 50px;
}
.hero-banner__bubbles span:nth-child(3) {
  width: 40px; height: 40px;
  top: 20px; right: 90px;
}
.hero-banner__label {
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--teal-100);
  margin-bottom: .5rem;
}
.hero-banner__title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--white);
  line-height: 1.2;
  margin-bottom: .75rem;
}
.hero-banner__desc {
  font-size: .85rem;
  color: rgba(255,255,255,.75);
  line-height: 1.6;
  max-width: 260px;
}

/* Actions */
.home-actions {
  display: flex;
  flex-direction: column;
  gap: .75rem;
  padding: 1.25rem 1.25rem 0;
}

/* Section Title */
.section-title {
  font-family: var(--font-display);
  font-size: .95rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: .85rem;
}

/* Latest Order */
.latest-order {
  padding: 1.5rem 1.25rem 0;
}

/* Features */
.features {
  padding: 1.5rem 1.25rem 0;
}
.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .6rem;
}
.feature-card {
  background: var(--neutral-50);
  border: 1.5px solid var(--neutral-100);
  border-radius: var(--radius-md);
  padding: 1rem;
  transition: all var(--transition);
}
.feature-card:hover {
  border-color: var(--teal-300);
  background: var(--teal-50);
}
.feature-card__icon {
  font-size: 1.4rem;
  display: block;
  margin-bottom: .4rem;
}
.feature-card strong {
  font-size: .875rem;
  font-family: var(--font-display);
  display: block;
  margin-bottom: .2rem;
  color: var(--neutral-900);
}
.feature-card p {
  font-size: .78rem;
  color: var(--neutral-500);
  line-height: 1.4;
}

/* Services Info */
.services-info {
  padding: 1.5rem 1.25rem 0;
}
.service-list {
  background: var(--neutral-50);
  border: 1.5px solid var(--neutral-100);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.service-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .9rem 1rem;
  border-bottom: 1px solid var(--neutral-100);
  gap: .75rem;
}
.service-row:last-child { border-bottom: none; }
.service-row__left {
  display: flex;
  align-items: center;
  gap: .75rem;
}
.service-row__left span:first-child { font-size: 1.2rem; }
.service-row__left strong {
  display: block;
  font-size: .875rem;
  color: var(--neutral-900);
}
.service-row__left p {
  font-size: .775rem;
  color: var(--neutral-500);
  margin: 0;
}
.service-row__price {
  font-family: var(--font-display);
  font-size: .825rem;
  font-weight: 700;
  color: var(--teal-600, var(--teal-700));
  white-space: nowrap;
  flex-shrink: 0;
}

/* How It Works */
.how-it-works {
  padding: 1.5rem 1.25rem 0;
}
.steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}
.steps::before {
  content: '';
  position: absolute;
  left: 1.1rem;
  top: 1.5rem;
  bottom: 1.5rem;
  width: 2px;
  background: linear-gradient(to bottom, var(--teal-400), var(--teal-100));
  border-radius: 99px;
}
.step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: .6rem 0;
  position: relative;
}
.step__number {
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
  box-shadow: 0 0 0 4px var(--white);
}
.step__content {
  padding-top: .2rem;
  padding-bottom: .75rem;
}
.step__content strong {
  display: block;
  font-size: .9rem;
  color: var(--neutral-900);
  margin-bottom: .15rem;
}
.step__content p {
  font-size: .8rem;
  color: var(--neutral-500);
  line-height: 1.5;
}

/* Operational Info */
.operational-info {
  padding: 1.5rem 1.25rem 0;
}
.info-card {
  background: var(--neutral-50);
  border: 1.5px solid var(--neutral-100);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .8rem 1rem;
  border-bottom: 1px solid var(--neutral-100);
  font-size: .875rem;
}
.info-row:last-child { border-bottom: none; }
.info-row span:first-child { color: var(--neutral-700); }
.info-row span:last-child {
  font-weight: 600;
  color: var(--neutral-900);
  font-family: var(--font-display);
  font-size: .825rem;
}

/* Admin Link */
.admin-link {
  margin: 1.5rem 1.25rem 0;
  padding: 1rem;
  background: var(--neutral-50);
  border: 1.5px dashed var(--neutral-200, var(--neutral-100));
  border-radius: var(--radius-md);
  text-align: center;
}
.admin-link a {
  font-size: .875rem;
  color: var(--neutral-500);
}
.admin-link a:hover { color: var(--teal-500); }

/* Footer */
.home-footer {
  margin-top: 2rem;
  padding: 1.25rem;
  text-align: center;
  border-top: 1px solid var(--neutral-100);
}
.home-footer p {
  font-size: .78rem;
  color: var(--neutral-300);
}
</style>