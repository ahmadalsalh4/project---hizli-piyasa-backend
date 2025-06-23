function ValidateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function ValidateNumber(number) {
  return !isNaN(number);
}

function ValidatePhoneNumber(phone) {
  const re = /^\+?(\d{1,3})?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
  return re.test(phone);
}

function ValidatePassword(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

function ValidISODateTime(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date.toString() !== "Invalid Date" && !isNaN(date);
}

module.exports = {
  ValidateEmail,
  ValidateNumber,
  ValidatePhoneNumber,
  ValidatePassword,
  ValidISODateTime,
};
