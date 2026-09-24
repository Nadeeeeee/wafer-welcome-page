import * as THREE from "three";

/** Warm waffle-grid texture for the wafer sheets. */
export function createWaferTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "#ecb36a");
  grad.addColorStop(1, "#d9984e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const cell = size / 8;
  for (let x = 0; x <= 8; x++) {
    ctx.strokeStyle = "#c17f38";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x * cell, 0);
    ctx.lineTo(x * cell, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, x * cell);
    ctx.lineTo(size, x * cell);
    ctx.stroke();

    ctx.strokeStyle = "#f6cd93";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x * cell + 3, 0);
    ctx.lineTo(x * cell + 3, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, x * cell + 3);
    ctx.lineTo(size, x * cell + 3);
    ctx.stroke();
  }

  for (let i = 0; i < 220; i++) {
    ctx.fillStyle =
      Math.random() > 0.5
        ? "rgba(255, 236, 200, 0.35)"
        : "rgba(150, 92, 40, 0.25)";
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
