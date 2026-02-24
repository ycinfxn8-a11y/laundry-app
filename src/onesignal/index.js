import { useOneSignal } from '@onesignal/onesignal-vue3'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export async function initOneSignal(userId) {
  const oneSignal = useOneSignal()

  // Minta izin notifikasi
  await oneSignal.Notifications.requestPermission()

  // Ambil subscription ID dan simpan ke Firestore
  const playerId = oneSignal.User.PushSubscription.id

  if (playerId && userId) {
    await updateDoc(doc(db, 'users', userId), {
      oneSignalPlayerId: playerId
    })
    console.log('Player ID tersimpan:', playerId)
  }

  // Listener jika subscription berubah
  oneSignal.User.PushSubscription.addEventListener('change', async (event) => {
    const newPlayerId = event.current.id
    if (newPlayerId && userId) {
      await updateDoc(doc(db, 'users', userId), {
        oneSignalPlayerId: newPlayerId
      })
    }
  })
}

export async function sendPushNotification(playerId, title, body) {
  if (!playerId) return

  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${import.meta.env.VITE_ONESIGNAL_API_KEY}`
    },
    body: JSON.stringify({
      app_id: import.meta.env.VITE_ONESIGNAL_APP_ID,
      include_player_ids: [playerId],
      headings: { en: title },
      contents: { en: body },
    })
  })
}