const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/app.log");

function logError(error) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ERROR: ${error.stack || error}\n`;

  // Logs klasörü yoksa oluştur
  if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath));
  }

  // Dosyaya log ekle
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Log dosyasına yazılamadı:", err);
  });

  // Konsola da yaz
  console.error(logMessage);
}

module.exports = { logError };
