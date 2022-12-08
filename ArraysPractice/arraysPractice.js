(function () {
    function getEvenNumbersSquares(numbers) {
        var evenNumbersSquares = [];

        numbers.filter(function (number) {
            return number % 2 === 0;
        }).forEach(function (number) {
            evenNumbersSquares.push(number * number);
        });

        return evenNumbersSquares;
    }

    function getEvenNumbersSum(numbers) {
        return numbers.reduce(function (summa, number) {
            if (number % 2 === 0) {
                return summa + number;
            }

            return summa;
        }, 0);
    }

    function getDescendingSortedNumbers(numbers) {
        return numbers.slice().sort(function (number1, number2) {
            return number2 - number1;
        });
    }

    var numbers = [10, 2, 43, 46, 15, 5, 3, 3, 67, 12, 2, 501, 333];

    console.log("Массив:");
    console.log(numbers);

    console.log("Отсортированный по убыванию массив:");
    console.log(getDescendingSortedNumbers(numbers));

    var numbersCount = 5;
    var firstNumbers = numbers.slice(0, numbersCount);

    console.log("Первые 5 элементов массива:");
    console.log(firstNumbers);

    var lastNumbers = numbers.slice(numbers.length - numbersCount);

    console.log("Последние 5 элементов массива:");
    console.log(lastNumbers);

    console.log("Сумма четных чисел = " + getEvenNumbersSum(numbers))

    numbers = [];

    for (var i = 1; i <= 100; i++) {
        numbers.push(i);
    }

    console.log("Массив от 1 до 100:");
    console.log(numbers);

    console.log("Массив квадратов четных чисел от 1 до 100:");
    console.log(getEvenNumbersSquares(numbers));
})();