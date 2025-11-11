const PITCH_CLASSES = ["All","C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const tableBody = document.querySelector("#tonesTable tbody");
const buttonsWrap = document.getElementById("pitchButtons");

// ピッチクラスボタン生成
function buildButtons() {
  PITCH_CLASSES.forEach((pc, i) => {
    const btn = document.createElement("button");
    btn.textContent = pc;
    btn.dataset.pc = pc;
    if (i === 0) btn.classList.add("active");
    btn.addEventListener("click", () => {
      document.querySelectorAll(".buttons button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(pc);
      history.replaceState(null, "", pc === "All" ? "#" : `#${encodeURIComponent(pc)}`);
    });
    buttonsWrap.appendChild(btn);
  });
}

// 音名からピッチクラス抽出
function pcFromNoteLabel(label) {
  const m = label.match(/^[A-G]#?/);
  return m ? m[0] : "";
}

// テーブル行追加
function addRow(row) {
  const tr = document.createElement("tr");
  tr.dataset.pc = pcFromNoteLabel(row.note);

  const tdNote = document.createElement("td");
  tdNote.textContent = row.note;

  const tdMidi = document.createElement("td");
  tdMidi.textContent = row.midi;

  const tdFreq = document.createElement("td");
  tdFreq.textContent = Number(row.freq).toFixed(3);

  const tdLow = document.createElement("td");
  tdLow.textContent = Number(row.low).toFixed(3);

  const tdHigh = document.createElement("td");
  tdHigh.textContent = Number(row.high).toFixed(3);

  tr.append(tdNote, tdMidi, tdFreq, tdLow, tdHigh);
  tableBody.appendChild(tr);
}

// フィルタ適用
function applyFilter(pc) {
  const rows = tableBody.querySelectorAll("tr");
  if (pc === "All") {
    rows.forEach(r => r.classList.remove("hidden"));
    return;
  }
  rows.forEach(r => {
    if (r.dataset.pc === pc) r.classList.remove("hidden");
    else r.classList.add("hidden");
  });
}

// ±½ Oct 表示トグル設定
function setupOctToggle() {
  const toggle = document.getElementById("toggleOct");

  function updateDisplay() {
    const show = toggle.checked;
    // 毎回列を再取得（モバイル対応）
    const cols = document.querySelectorAll(
      "th:nth-child(4), td:nth-child(4), th:nth-child(5), td:nth-child(5)"
    );
    cols.forEach(el => {
      el.style.display = show ? "" : "none";
    });
  }

  toggle.addEventListener("change", updateDisplay);
  updateDisplay(); // 初期反映
}

// メイン処理
async function main() {
  buildButtons();

  const res = await fetch("./tones.json", { cache: "no-store" });
  if (!res.ok) {
    tableBody.innerHTML = `<tr><td colspan="5">Failed to load tones.json</td></tr>`;
    return;
  }

  const data = await res.json();
  data.forEach(addRow);

  const initHash = decodeURIComponent(location.hash.replace("#","")).toUpperCase();
  const pc = PITCH_CLASSES.includes(initHash) ? initHash : "All";
  applyFilter(pc);

  setupOctToggle();
}

// DOM構築後に実行
document.addEventListener("DOMContentLoaded", main);
