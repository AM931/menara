/**
 * Visualisasi Rekursif Menara Hanoi - JavaScript Engine
 * Author: Antigravity Assistant
 * Study Case: Analisis N=100 & Simulasi Perpindahan Menara (> 10 Langkah)
 */

// State Global
let diskCount = 4; // Default 4 balok (15 langkah > 10 langkah)
let moves = [];
let currentMoveIndex = 0;
let isPlaying = false;
let playInterval = null;
let animationSpeed = 400; // ms

// Representasi Tiang (Array balok, index 0 adalah balok paling bawah)
let pegs = {
  A: [],
  B: [],
  C: []
};

// Palet warna gradien balok agar kontras dan estetik
const DISK_COLORS = [
  'from-rose-500 to-pink-600',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-600',
  'from-cyan-400 to-blue-500',
  'from-indigo-500 to-purple-600',
  'from-purple-500 to-fuchsia-600',
  'from-pink-400 to-rose-600',
  'from-lime-400 to-emerald-600',
  'from-sky-400 to-indigo-600',
  'from-yellow-400 to-amber-600'
];

/**
 * Inisialisasi saat halaman selesai dimuat
 */
document.addEventListener('DOMContentLoaded', () => {
  initSimulation();
  buildTracingTable(4);
  generateCustomTask(); // Jalankan inisialisasi awal generator tugas
});

/**
 * Generator Urutan Langkah Rekursif Menara Hanoi
 */
function solveHanoiRecursive(n, from, to, aux, moveList) {
  if (n === 1) {
    moveList.push({
      step: moveList.length + 1,
      disk: 1,
      from: from,
      to: to,
      aux: aux,
      phase: 'Base Case (Kasus Dasar n=1)'
    });
    return;
  }

  // Langkah 1: Pindahkan n-1 balok dari Asal ke Bantuan
  solveHanoiRecursive(n - 1, from, aux, to, moveList);

  // Langkah 2: Pindahkan balok ke-n (terbesar) dari Asal ke Tujuan
  moveList.push({
    step: moveList.length + 1,
    disk: n,
    from: from,
    to: to,
    aux: aux,
    phase: `Langkah 2: Balok Terbesar (${n}) ke Tujuan`
  });

  // Langkah 3: Pindahkan n-1 balok dari Bantuan ke Tujuan
  solveHanoiRecursive(n - 1, aux, to, from, moveList);
}

/**
 * Inisialisasi Ulang Simulasi
 */
function initSimulation() {
  pauseSimulation();
  currentMoveIndex = 0;
  
  // Setup Tiang Awal: Semua balok ada di Tiang A (dari terbesar di dasar ke terkecil di atas)
  pegs = {
    A: [],
    B: [],
    C: []
  };
  for (let i = diskCount; i >= 1; i--) {
    pegs.A.push(i);
  }

  // Hitung seluruh langkah rekursif
  moves = [];
  solveHanoiRecursive(diskCount, 'A', 'B', 'C', moves);

  // Update metrik visual
  updateMetricsDisplay();
  renderPegs();
  renderStepLogs();
  updateStepIndicator();
}

/**
 * Render Balok di Tiang A, B, C
 */
function renderPegs() {
  ['A', 'B', 'C'].forEach(pegKey => {
    const container = document.getElementById(`disks-${pegKey}`);
    if (!container) return;
    container.innerHTML = '';

    const disks = pegs[pegKey];
    disks.forEach(diskNum => {
      const diskEl = document.createElement('div');
      diskEl.id = `disk-item-${diskNum}`;
      diskEl.className = `hanoi-disk h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-md bg-gradient-to-r ${DISK_COLORS[(diskNum - 1) % DISK_COLORS.length]}`;
      
      // Ukuran proporsional: balok 1 kecil, balok n besar
      const widthPercent = 30 + ((diskNum / diskCount) * 65);
      diskEl.style.width = `${Math.min(widthPercent, 95)}%`;
      diskEl.innerHTML = `<span class="drop-shadow">${diskNum}</span>`;
      
      container.appendChild(diskEl);
    });
  });
}

/**
 * Update Tampilan Metrik & Banner
 */
function updateMetricsDisplay() {
  const totalMoves = Math.pow(2, diskCount) - 1;
  
  const metricDisks = document.getElementById('metric-disks');
  const metricTotalMoves = document.getElementById('metric-total-moves');
  const metricSyarat = document.getElementById('metric-syarat');
  const diskCountDisplay = document.getElementById('disk-count-display');
  const maxStepNum = document.getElementById('max-step-num');
  const logCount = document.getElementById('log-count');

  if (metricDisks) metricDisks.innerText = `${diskCount} Balok`;
  if (metricTotalMoves) metricTotalMoves.innerText = `${totalMoves.toLocaleString('id-ID')} Langkah`;
  if (diskCountDisplay) diskCountDisplay.innerText = `${diskCount} Balok (${totalMoves.toLocaleString('id-ID')} Langkah)`;
  if (maxStepNum) maxStepNum.innerText = totalMoves.toLocaleString('id-ID');
  if (logCount) logCount.innerText = `${totalMoves.toLocaleString('id-ID')} langkah`;

  if (metricSyarat) {
    if (totalMoves > 10) {
      metricSyarat.className = 'text-sm font-semibold text-emerald-400 flex items-center justify-center gap-1 mt-1';
      metricSyarat.innerHTML = '<i class="fa-solid fa-circle-check"></i> Memenuhi (> 10)';
    } else {
      metricSyarat.className = 'text-sm font-semibold text-amber-400 flex items-center justify-center gap-1 mt-1';
      metricSyarat.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Belum > 10';
    }
  }
}

/**
 * Render Log Riwayat Perpindahan
 */
function renderStepLogs() {
  const container = document.getElementById('step-log-container');
  if (!container) return;
  container.innerHTML = '';

  moves.forEach((m, idx) => {
    const item = document.createElement('div');
    item.id = `log-item-${idx}`;
    item.className = 'p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition flex items-center justify-between text-[11px]';
    item.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-400 font-bold">${m.step}</span>
        <span>Balok <b class="text-indigo-300">${m.disk}</b></span>
      </div>
      <div class="flex items-center gap-1 font-semibold">
        <span class="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Tiang ${m.from}</span>
        <i class="fa-solid fa-arrow-right text-[10px] text-slate-500"></i>
        <span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Tiang ${m.to}</span>
      </div>
    `;
    container.appendChild(item);
  });
}

/**
 * Update Indikator Langkah & Progress Bar
 */
function updateStepIndicator() {
  const currentStepNum = document.getElementById('current-step-num');
  const currentStepText = document.getElementById('current-step-text');
  const progressBar = document.getElementById('simulation-progress');

  if (currentStepNum) currentStepNum.innerText = currentMoveIndex;

  const totalMoves = moves.length;
  const progressPercent = totalMoves > 0 ? (currentMoveIndex / totalMoves) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progressPercent}%`;

  if (currentMoveIndex === 0) {
    if (currentStepText) currentStepText.innerHTML = `Siap menjalankan simulasi untuk <b>${diskCount} balok</b> (${totalMoves} perpindahan).`;
  } else if (currentMoveIndex <= totalMoves) {
    const lastMove = moves[currentMoveIndex - 1];
    if (currentStepText) {
      currentStepText.innerHTML = `Langkah ${lastMove.step}: Memindahkan <b class="text-indigo-400">Balok ${lastMove.disk}</b> dari <b class="text-indigo-300">Tiang ${lastMove.from}</b> &rarr; <b class="text-emerald-300">Tiang ${lastMove.to}</b>.`;
    }
  }

  // Highlight log item saat ini
  document.querySelectorAll('#step-log-container > div').forEach((el, idx) => {
    if (idx === currentMoveIndex - 1) {
      el.classList.add('border-indigo-500', 'bg-indigo-950/40', 'glow-indigo');
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      el.classList.remove('border-indigo-500', 'bg-indigo-950/40', 'glow-indigo');
    }
  });

  if (currentMoveIndex === totalMoves && totalMoves > 0) {
    if (currentStepText) {
      currentStepText.innerHTML = `<span class="text-emerald-400 font-bold"><i class="fa-solid fa-flag-checkered"></i> Selesai! Seluruh balok berhasil dipindahkan ke Tiang B (${totalMoves} langkah).</span>`;
    }
    pauseSimulation();
  }
}

/**
 * Langkah Maju 1 Langkah
 */
function stepNext() {
  if (currentMoveIndex >= moves.length) return false;

  const move = moves[currentMoveIndex];
  // Pindahkan balok dari tiang asal ke tujuan
  const disk = pegs[move.from].pop();
  pegs[move.to].push(disk);

  currentMoveIndex++;
  renderPegs();
  updateStepIndicator();
  return true;
}

/**
 * Langkah Mundur 1 Langkah (Undo)
 */
function stepPrevious() {
  if (currentMoveIndex <= 0) return false;

  pauseSimulation();
  currentMoveIndex--;
  const move = moves[currentMoveIndex];
  
  // Kembalikan balok dari tujuan ke asal
  const disk = pegs[move.to].pop();
  pegs[move.from].push(disk);

  renderPegs();
  updateStepIndicator();
  return true;
}

/**
 * Putar / Jeda Otomatis
 */
function togglePlay() {
  if (isPlaying) {
    pauseSimulation();
  } else {
    startSimulation();
  }
}

function startSimulation() {
  if (currentMoveIndex >= moves.length) {
    initSimulation();
  }
  isPlaying = true;
  updatePlayButtonUI();

  playInterval = setInterval(() => {
    const hasNext = stepNext();
    if (!hasNext) {
      pauseSimulation();
    }
  }, animationSpeed);
}

function pauseSimulation() {
  isPlaying = false;
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
  }
  updatePlayButtonUI();
}

function resetSimulation() {
  initSimulation();
}

function updatePlayButtonUI() {
  const icon = document.getElementById('btn-play-icon');
  const text = document.getElementById('btn-play-text');
  if (!icon || !text) return;

  if (isPlaying) {
    icon.className = 'fa-solid fa-pause';
    text.innerText = 'Jeda';
  } else {
    icon.className = 'fa-solid fa-play';
    text.innerText = 'Putar';
  }
}

function changeSpeed(speedMs) {
  animationSpeed = parseInt(speedMs, 10);
  if (isPlaying) {
    pauseSimulation();
    startSimulation();
  }
}

function changeDiskCount(newCount) {
  diskCount = newCount;
  initSimulation();
}

function handlePegClick(pegKey) {
  // Interactive click feature: jump to next move if ready
  if (!isPlaying) {
    stepNext();
  }
}

/**
 * Switch Tab Navigasi
 */
function switchTab(tabId) {
  const tabs = ['simulator', 'python', 'pseudocode', 'n100', 'generator', 'deploy'];
  tabs.forEach(t => {
    const content = document.getElementById(`tab-content-${t}`);
    const btn = document.getElementById(`tab-btn-${t}`);
    if (content) {
      if (t === tabId) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    }
    if (btn) {
      if (t === tabId) {
        btn.classList.add('active');
        btn.classList.remove('text-slate-400');
        btn.classList.add('text-white');
      } else {
        btn.classList.remove('active');
        btn.classList.add('text-slate-400');
        btn.classList.remove('text-white');
      }
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Bangun Tabel Tracing Rekursif (Tugas 2)
 */
function buildTracingTable(n = 4) {
  const tbody = document.getElementById('tracing-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const traceMoves = [];
  solveHanoiRecursive(n, 'A', 'B', 'C', traceMoves);

  traceMoves.forEach(m => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/60 transition';
    
    let phaseBadge = '';
    if (m.disk === 1) {
      phaseBadge = '<span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">Base Case (n=1)</span>';
    } else if (m.disk === n) {
      phaseBadge = '<span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">Pindah Balok Terbesar</span>';
    } else {
      phaseBadge = '<span class="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">Sub-Masalah Rekursif</span>';
    }

    tr.innerHTML = `
      <td class="px-4 py-3 font-bold text-slate-300">Langkah #${m.step}</td>
      <td class="px-4 py-3 font-mono text-cyan-300 text-xs">pindahBalok(${m.disk}, '${m.from}', '${m.to}', '${m.aux}')</td>
      <td class="px-4 py-3 font-bold text-indigo-400">Balok ${m.disk}</td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Tiang ${m.from}</span></td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Tiang ${m.to}</span></td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Tiang ${m.aux}</span></td>
      <td class="px-4 py-3">${phaseBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Generator Tugas Unik Mahasiswa (Anti-Plagiasi Se-Kelas)
 */
function generateCustomTask() {
  const namaInput = document.getElementById('gen-nama');
  const nimInput = document.getElementById('gen-nim');

  const nama = namaInput ? (namaInput.value.trim() || 'Budi Santoso') : 'Budi Santoso';
  const nim = nimInput ? (nimInput.value.trim() || '2024010199') : '2024010199';

  // Ekstrak angka dari NIM untuk rumus unik
  const nimDigits = nim.replace(/\D/g, '');
  const nimVal = nimDigits.length >= 2 ? parseInt(nimDigits.slice(-3), 10) : 123;

  // Rumus: n = 10 + (nimVal % 15) + 1  --> Selalu menghasilkan n antara 11 s/d 25
  const nUnik = 10 + (nimVal % 15) + 1;
  const totalLangkahBig = (BigInt(2) ** BigInt(nUnik)) - BigInt(1);

  // Update UI Result
  const resN = document.getElementById('gen-res-n');
  const resMoves = document.getElementById('gen-res-moves');
  const resPegs = document.getElementById('gen-res-pegs');

  if (resN) resN.innerText = `${nUnik} Balok`;
  if (resMoves) resMoves.innerText = `${totalLangkahBig.toLocaleString('id-ID')} Kali`;
  if (resPegs) resPegs.innerText = `Tiang A → Tiang B (Bantuan C)`;

  // Generate personalized Python snippet
  const personalCodeDisplay = document.getElementById('personal-code-display');
  if (personalCodeDisplay) {
    personalCodeDisplay.innerText = `# ==============================================================================
# TUGAS REKURSIF MENARA HANOI - PERSONAL MAHASISWA
# Nama Mahasiswa : ${nama}
# NIM            : ${nim}
# Parameter Unik : n = ${nUnik} Balok (Pasti > 10 Balok)
# Total Langkah  : 2^${nUnik} - 1 = ${totalLangkahBig.toLocaleString('id-ID')} Perpindahan (Pasti > 10 Langkah)
# ==============================================================================

langkah_ke = 0

def pindah_balok_${nimDigits.slice(-4) || 'mhs'}(n, asal='A', tujuan='B', bantuan='C', batas_tampil=30):
    global langkah_ke
    if n == 1:
        langkah_ke += 1
        if langkah_ke <= batas_tampil:
            print(f"Langkah {langkah_ke:4d}: Balok 1 dipindah dari {asal} ke {tujuan}")
        return

    # 1. Pindah n-1 ke Bantuan
    pindah_balok_${nimDigits.slice(-4) || 'mhs'}(n - 1, asal, bantuan, tujuan, batas_tampil)

    # 2. Pindah balok ke-n ke Tujuan
    langkah_ke += 1
    if langkah_ke <= batas_tampil:
        print(f"Langkah {langkah_ke:4d}: Balok {n} (terbesar) dipindah dari {asal} ke {tujuan}")

    # 3. Pindah n-1 dari Bantuan ke Tujuan
    pindah_balok_${nimDigits.slice(-4) || 'mhs'}(n - 1, bantuan, tujuan, asal, batas_tampil)

if __name__ == "__main__":
    print("Program Rekursif Menara Hanoi milik ${nama} (${nim})")
    print("Menjalankan dengan n = ${nUnik} balok...")
    pindah_balok_${nimDigits.slice(-4) || 'mhs'}(${nUnik}, 'A', 'B', 'C')
    print("\\nTotal perpindahan teori: ${(2 ** nUnik) - 1:,} kali langkah.")
`;
  }
}

/**
 * Clipboard & Toast Notifications
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.innerText = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 2500);
}

function copyPythonCode() {
  const code = document.getElementById('python-code-display')?.innerText || '';
  navigator.clipboard.writeText(code).then(() => {
    showToast('Kode Python berhasil disalin ke clipboard!');
  });
}

function copyPseudocode() {
  const code = document.getElementById('pseudocode-display')?.innerText || '';
  navigator.clipboard.writeText(code).then(() => {
    showToast('Notasi Pseudocode berhasil disalin!');
  });
}

function copyPersonalCode() {
  const code = document.getElementById('personal-code-display')?.innerText || '';
  navigator.clipboard.writeText(code).then(() => {
    showToast('Script Python personal Anda berhasil disalin!');
  });
}

function copyCliCommands() {
  const code = document.getElementById('cli-commands-code')?.innerText || '';
  navigator.clipboard.writeText(code).then(() => {
    showToast('Perintah Command Prompt disalin!');
  });
}

function copyGitCommands() {
  const code = document.getElementById('git-commands-code')?.innerText || '';
  navigator.clipboard.writeText(code).then(() => {
    showToast('Perintah Git disalin!');
  });
}
