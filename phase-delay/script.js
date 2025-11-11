function toHalfWidthDigits(s){
  return s.replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0)-0xFEE0))
          .replace(/\uFF0E/g, '.');
}

function normalizeNumber(str){
  return toHalfWidthDigits(str)
    .trim()
    .replace(/^[\+\uFF0B]+/, '')
    .replace(/[\u2212\uFF0D]/g,'-')
    .replace(',', '.');
}

function compute(){
  const phiStr = normalizeNumber(document.getElementById('phi').value);
  const f  = parseFloat(document.getElementById('freq').value);
  const fs = parseInt(document.getElementById('fs').value,10);
  const phi = parseFloat(phiStr);
  const out = document.getElementById('out');

  if ([phi,f,fs].some(Number.isNaN)) { out.textContent = 'Invalid input'; return; }

  const ms  = -(phi/360) * (1000/f);
  const smp = -(phi/360) * (fs/f);
  const sign = ms>0 ? 'delay' : ms<0 ? 'advance' : '';
  out.textContent = `${ms.toFixed(3)} ms  |  ${smp.toFixed(1)} samples  (${sign})`;
}

window.addEventListener('DOMContentLoaded', () => {
  const phi  = document.getElementById('phi');
  const freq = document.getElementById('freq');
  const fs   = document.getElementById('fs');

  // 各入力要素のあらゆる変化で計算
  ['input','change','blur'].forEach(evt => {
    phi.addEventListener(evt, compute);
    freq.addEventListener(evt, compute);
    fs.addEventListener(evt, compute);
  });

  compute(); // 初期値で実行
});
