// QR.js встроенная мини‑библиотека
class QRCodeGen {
  static generate(text, size = 230) {
    const qr = new QRious({ value: text, size });
    return qr;
  }
}

// Подключение  QR‑библиотеки
const qrScript = document.createElement("script");
qrScript.src =
  "https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js";
document.body.appendChild(qrScript);

// Элементы
const input = document.getElementById("qr-input");
const generateBtn = document.getElementById("generate");
const downloadBtn = document.getElementById("download");
const canvas = document.getElementById("qr-canvas");
let qr;

// Создание QR
function generateQR() {
  if (!input.value.trim()) return;
  qr = new QRious({ element: canvas, value: input.value, size: 230 });
}

generateBtn.addEventListener("click", generateQR);

// Скачивание
function downloadQR() {
  if (!qr) return;
  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = canvas.toDataURL();
  link.click();
}
downloadBtn.addEventListener("click", downloadQR);
