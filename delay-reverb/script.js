function calcReverbTimes(bpm) {
  const beatMs = 60000 / bpm;
  const barMs = beatMs * 4;
  return [
    { name: "Hall (2 Bars)", total: barMs * 2, ratio: 1/64 },
    { name: "Large Room (1 Bar)", total: barMs * 1, ratio: 1/64 },
    { name: "Small Room (1/2 Note)", total: beatMs * 2, ratio: 1/64 },
    { name: "Tight Ambience (1/4 Note)", total: beatMs * 1, ratio: 1/128 }
  ].map(r => {
    const pre = r.total * r.ratio;
    const decay = r.total - pre;
    return { name: r.name, pre, decay, total: r.total };
  });
}

function renderTable(bpm) {
  const tbody = document.getElementById("result-body");
  const rows = calcReverbTimes(bpm);

  tbody.innerHTML = rows.map(r => {
    // "(...)" の前で改行を入れる
    const name = r.name.replace(/\s*\(([^)]+)\)/, "<br>($1)");
    return `
      <tr>
        <td>${name}</td>
        <td>${r.pre.toFixed(2)}</td>
        <td>${r.decay.toFixed(2)}</td>
        <td>${r.total.toFixed(2)}</td>
      </tr>
    `;
  }).join("");
}

const bpmInput = document.getElementById("bpm");
bpmInput.addEventListener("input", e => {
  const bpm = parseFloat(e.target.value);
  if (!isNaN(bpm) && bpm > 0) renderTable(bpm);
});

window.addEventListener("DOMContentLoaded", () => {
  renderTable(parseFloat(bpmInput.value));
});
