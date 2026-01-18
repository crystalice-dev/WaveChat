// src/boot/boot.js

export async function runBoot() {
  console.log('Boot started')

  const bootEl = document.getElementById('boot')
  if (!bootEl) {
    console.warn('Boot element not found')
    return
  }

  await delay(500)
  bootEl.classList.add('animate')

  await delay(4000)
  bootEl.classList.add('fade-out')

  await delay(1000)
  bootEl.remove()
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
