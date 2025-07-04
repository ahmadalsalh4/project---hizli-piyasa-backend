const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/app.log");

function logError(error) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ERROR: ${error.stack || error}\n`;

  if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath));
  }

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Log dosyasına yazılamadı:", err);
  });

  console.error(logMessage);
}

module.exports = { logError };
