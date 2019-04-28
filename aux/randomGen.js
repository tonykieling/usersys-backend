randomGeneretor = () => {
  const possiblities = "AbCdEfGhIjKlMnOpQrStUvWxYzaBcDeFgHiJkLmNoPqRsTuVwXyZ!@#$%0123456789^&*()_-=+/" // 78
  let result = "";
  let index = 0;
  for (let i = 0; i < 8; i = i + 1) {
    index = Math.floor(Math.random() * 78);
    result = result + possiblities[index];
  }

  return result;
}

module.exports = randomGeneretor;
