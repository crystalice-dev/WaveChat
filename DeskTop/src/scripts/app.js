// src/scripts/app.js
import { runBoot } from '../boot/boot.js';

window.addEventListener('DOMContentLoaded', start);

export let prof = null;

async function start() {
  await runBoot();
  window.location.replace('./src/views/preBoard/SignOnView.html');
}
