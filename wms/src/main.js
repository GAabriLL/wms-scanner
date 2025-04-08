import { Html5QrcodeScanner } from "html5-qrcode";

const scanner = new Html5QrcodeScanner("reader", {
  fps: 10,
  qrbox: 250,
});

scanner.render((decodedText) => {
  console.log("QR Code lido:", decodedText);
  document.getElementById("codigoProduto").value = decodedText;
  scanner.clear(); // Para o scanner depois de ler
});
