<h1 align="center">WMS com Leitura de QR Code</h1>

<p align="center">
  Sistema de gerenciamento de estoque com leitura de QR Code via navegador, utilizando a biblioteca <a href="https://github.com/mebjas/html5-qrcode" target="_blank">html5-qrcode</a>.
</p>

<hr>

<h2>Funcionalidades</h2>

<ul>
  <li>✅ Cadastro de produtos com nome, categoria, quantidade e localização</li>
  <li>✅ Leitura de QR Code pela câmera do navegador</li>
  <li>✅ Busca e visualização de produtos cadastrados</li>
  <li>✅ Interface web interativa e responsiva</li>
  <li>🔜 Integração com banco de dados</li>
</ul>

<h2>Tecnologias Utilizadas</h2>

<ul>
  <li><strong>HTML5, CSS3, JavaScript</strong></li>
  <li><strong>html5-qrcode</strong> (para leitura de QR Code)</li>
  <li><strong>(Futuramente)</strong> Node.js, Express, MongoDB ou MySQL</li>
</ul>

<h2>Scanner de QR Code</h2>

<p>Utilizamos a biblioteca <code>html5-qrcode</code> para capturar e interpretar QR Codes usando a câmera do dispositivo.</p>

<details>
<summary><strong>Exemplo de uso</strong></summary>

```html
<div id="reader"></div>
<script>
  const html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      console.log(`QR Code detectado: ${qrCodeMessage}`);
    },
    errorMessage => {
      // Ignora erros
    }
  );
</script>
