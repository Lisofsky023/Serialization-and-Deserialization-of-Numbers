const generateRandomNumbers = (count, min, max) =>
  Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);

const generateTestCases = () => ({
    random_50: generateRandomNumbers(50, 1, 300),
    random_100: generateRandomNumbers(100, 1, 300),
    random_500: generateRandomNumbers(500, 1, 300),
    random_1000: generateRandomNumbers(1000, 1, 300),
    all_single_digit: generateRandomNumbers(1000, 1, 9),
    all_two_digits: generateRandomNumbers(1000, 10, 99),
    all_three_digits: generateRandomNumbers(1000, 100, 300),
    three_of_each: Array.from({ length: 300 }, (_, i) => i + 1).flatMap(num => [num, num, num])
});

const serializeImproved = (numbers) => {
  numbers.sort((a, b) => a - b);

  let bitmask = new Array(300).fill(0);
  numbers.forEach(num => bitmask[num - 1] = 1);

  let serialized = '';
  let last = 0;

  for (let i = 0; i < bitmask.length; i++) {
    if (bitmask[i] === 1) {
      let delta = i - last;
      serialized += delta.toString(36) + ',';
      last = i;
    }
  }

  return serialized.slice(0, -1);
};

const deserializeImproved = (serialized) => {
  let deltas = serialized.split(',');
  let numbers = [];
  let last = 0;

  for (let delta of deltas) {
    last += parseInt(delta, 36);
    numbers.push(last + 1);
  }

  return numbers;
};

const calculateCompressionRate = (original, compressed) => {
    return ((original.length - compressed.length) / original.length) * 100;
};

document.getElementById('generate').addEventListener('click', () => {
  const testCases = generateTestCases();
  document.getElementById('test-data').textContent = JSON.stringify(testCases, null, 2);
});

document.getElementById('serialize').addEventListener('click', () => {
  const testData = JSON.parse(document.getElementById('test-data').textContent);
  const serialized = serializeImproved(testData.random_50);
  document.getElementById('serialized-data').textContent = serialized;

  const compressionRate = calculateCompressionRate(JSON.stringify(testData.random_50), serialized);
  document.getElementById('compression-rate').textContent = `Compression Rate: ${compressionRate.toFixed(2)}%`;
});

document.getElementById('deserialize').addEventListener('click', () => {
  const serializedData = document.getElementById('serialized-data').textContent;
  const deserialized = deserializeImproved(serializedData);
  document.getElementById('deserialized-data').textContent = JSON.stringify(deserialized, null, 2);
});
