randomGeneretor = () => {
  const possiblities = "AbCdEfGhIjKlMnOpQrStUvWxYzaBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789" // 62
  let result = "";
  let index = 0;
  for (let i = 0; i < 8; i = i + 1) {
    index = Math.floor(Math.random() * 62);
    result = result + possiblities[index];
  }
  
  return result;
}

module.exports = randomGeneretor;
