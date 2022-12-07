(function () {
    function getEvenNumbersSquaresArray(array) {
        var evenNumbersSquaresArray = [];

        array.filter(function (currentNumber) {
            return currentNumber % 2 === 0;
        }).forEach(function (currentNumber) {
            evenNumbersSquaresArray.push(currentNumber * currentNumber);
        });

        return evenNumbersSquaresArray;
    }

    function getEvenNumbersSum(array) {
        return array.reduce(function (summa, currentNumber) {
            if (currentNumber % 2 === 0) {
                return summa + currentNumber;
            }

            return summa;
        }, 0);
    }

    function getDescendingSortedArray(array) {
        return array.slice().sort(function (number1, number2) {
            return number2 - number1;
        });
    }

    var array = [10, 2, 43, 46, 15, 5, 3, 3, 67, 12, 2, 501, 333];

    console.log("Массив:");
    console.log(array);

    console.log("Отсортированный по убыванию массив:");
    console.log(getDescendingSortedArray(array));

    var elementsCount = 5;
    var firstElementsArray = array.slice(0, elementsCount);

    console.log("Первые 5 элементов массива:");
    console.log(firstElementsArray);

    var lastElementsArray = array.slice(array.length - elementsCount);

    console.log("Последние 5 элементов массива:");
    console.log(lastElementsArray);

    console.log("Сумма четных чисел = " + getEvenNumbersSum(array))

    array = [];

    for (var i = 1; i <= 100; i++) {
        array.push(i);
    }

    console.log("Массив от 1 до 100:");
    console.log(array);

    console.log("Массив квадратов четных чисел от 1 до 100:");
    console.log(getEvenNumbersSquaresArray(array));
})();