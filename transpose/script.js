const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const DEGREE_MAP = {
  0: "P1", 1: "m2", 2: "M2", 3: "m3", 4: "M3", 5: "P4",
  6: "Tritone", 7: "P5", 8: "m6", 9: "M6", 10: "m7", 11: "M7", 12: "P8"
};

let before = null;
let after = null;
const beforeButtons = {};
const afterButtons = {};

function renderButtons(containerId, isBefore, buttonMap) {
  const container = document.getElementById(containerId);
  NOTES.forEach(note => {
    const btn = document.createElement("button");
    btn.textContent = note;
    btn.className = "note-button";
    btn.onclick = () => {
      Object.values(buttonMap).forEach(b => b.classList.remove("selected", isBefore ? "before" : "after"));
      btn.classList.add("selected", isBefore ? "before" : "after");
      if (isBefore) before = note;
      else after = note;
      updateResult();
    };
    container.appendChild(btn);
    buttonMap[note] = btn;
  });
}

function getTransposeSteps(fromNote, toNote) {
  const fromIndex = NOTES.indexOf(fromNote);
  const toIndex = NOTES.indexOf(toNote);
  const up = (toIndex - fromIndex + 12) % 12;
  const down = (fromIndex - toIndex + 12) % 12;
  return { up, down };
}

function updateResult() {
  const upVal = document.getElementById("up-val");
  const downVal = document.getElementById("down-val");
  const upDeg = document.getElementById("up-degree");
  const downDeg = document.getElementById("down-degree");

  if (before && after) {
    const { up, down } = getTransposeSteps(before, after);
    upVal.textContent = `+${up}`;
    downVal.textContent = `-${down}`;
    upDeg.textContent = DEGREE_MAP[up] || "-";
    downDeg.textContent = DEGREE_MAP[down] || "-";
  } else {
    upVal.textContent = "-";
    downVal.textContent = "-";
    upDeg.textContent = "-";
    downDeg.textContent = "-";
  }
}

renderButtons("before-buttons", true, beforeButtons);
renderButtons("after-buttons", false, afterButtons);
