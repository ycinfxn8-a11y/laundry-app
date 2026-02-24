import { useOneSignal } from '@onesignal/onesignal-vue3'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

async function savePlayerId(oneSignal, userId) {
  const playerId = oneSignal.User.PushSubscription.id
  console.log('Player ID:', playerId)

  if (playerId && userId) {
    await updateDoc(doc(db, 'users', userId), {
      oneSignalPlayerId: playerId
    })
    console.log('Player ID tersimpan:', playerId)
  } else {
    console.warn('Player ID masih kosong')
  }
}

export async function initOneSignal(userId) {
  const oneSignal = useOneSignal()

  // Tunggu OneSignal selesai load
  await new Promise((resolve) => {
    if (oneSignal.Notifications.permission !== undefined) {
      resolve()
    } else {
      oneSignal.on('permissionChange', resolve)
    }
  })

  // Minta izin notifikasi
  await oneSignal.Notifications.requestPermission()
  // Cara alternatif ambil subscription ID
    const subscription = await oneSignal.User.PushSubscription
    console.log('Subscription object:', subscription)
    console.log('ID:', subscription.id)
    console.log('Token:', subscription.token)

  console.log('Permission:', oneSignal.Notifications.permission)
  console.log('Opted In:', oneSignal.User.PushSubscription.optedIn)

  // Coba ambil Player ID langsung
  await savePlayerId(oneSignal, userId)

  // Fallback: listener jika Player ID baru tersedia setelah subscribe
  oneSignal.User.PushSubscription.addEventListener('change', async (event) => {
    console.log('Subscription change event:', event)
    await savePlayerId(oneSignal, userId)
  })
}

export async function sendPushNotification(playerId, title, body) {
  console.log('Kirim notif ke:', playerId)
  if (!playerId) {
    console.warn('Player ID kosong')
    return
  }

  try {
    const res = await fetch('https://onesignal.com/api/v1/notifications', {
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

    const data = await res.json()
    console.log('Response OneSignal:', data)
  } catch (err) {
    console.error('Error:', err)
  }
}