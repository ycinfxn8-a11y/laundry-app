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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  background: #f0b429;
  color: #f5c842;
  padding: .95rem 2rem;
  border-radius: var(--radius-xl);
  font-size: 1rem;
  font-weight: 800;
  font-family: var(--font-display);
  border: none;
  cursor: pointer;
  transition: all var(--transition);
  /*box-shadow: 0 8px 24px rgba(240,180,41,.35);*/
  width: 100%;
  letter-spacing: .01em;
  background: var(--white);
}
.login-hero button:hover:not(:disabled) {
  background: #f5c842;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(240,180,41,.45);
}
.login-hero button:disabled {
  opacity: .6;
  cursor: not-allowed;
}


</style>