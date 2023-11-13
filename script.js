// Функция для генерации случайных чисел
const generateRandomNumbers = (count, min, max) =>
  Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);

// Функция для генерации тестовых случаев
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

// Функция сериализации
const serialize = (numbers) => {
    numbers.sort((a, b) => a - b);

    return numbers.reduce((result, num, i) => {
        if (i === 0 || num !== numbers[i - 1] && num !== numbers[i - 1] + 1) {
            result.push(num);
        } else if (num === numbers[i - 1]) {
            const last = result[result.length - 1];
            if (typeof last === 'string' && last.includes('*')) {
                result[result.length - 1] = `${num}*${parseInt(last.split('*')[1], 10) + 1}`;
            } else {
                result[result.length - 1] = `${num}*2`;
            }
        } else {
            const last = result[result.length - 1];
            if (typeof last === 'string' && last.includes('-')) {
                result[result.length - 1] = `${last.split('-')[0]}-${num}`;
            } else {
                result[result.length - 1] = `${last}-${num}`;
            }
        }
        return result;
    }, []).join(",");
};

// Функция десериализации
const deserialize = (serialized) =>
  serialized.split(",").flatMap(part => {
      if (part.includes('-')) {
          let [start, end] = part.split('-').map(Number);
          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      } else if (part.includes('*')) {
          let [num, count] = part.split('*').map(Number);
          return Array.from({ length: count }, () => num);
      }
      return Number(part);
  });

const testCases = generateTestCases();
console.log(testCases);

let numbers = [1, 2, 2, 2, 3, 4, 5, 6, 7];
let serialized = serialize(numbers);
let deserialized = deserialize(serialized);

console.log("Исходный массив:", numbers);
console.log("Сериализованная строка:", serialized);
console.log("Десериализованный массив:", deserialized);

document.getElementById('generate').addEventListener('click', () => {
  const testCases = generateTestCases();
  document.getElementById('test-data').textContent = JSON.stringify(testCases, null, 2);
});

document.getElementById('serialize').addEventListener('click', () => {
  const testData = JSON.parse(document.getElementById('test-data').textContent);
  const serialized = serialize(testData.random_50);
  document.getElementById('serialized-data').textContent = serialized;
});

document.getElementById('deserialize').addEventListener('click', () => {
  const serializedData = document.getElementById('serialized-data').textContent;
  const deserialized = deserialize(serializedData);
  document.getElementById('deserialized-data').textContent = JSON.stringify(deserialized, null, 2);
});