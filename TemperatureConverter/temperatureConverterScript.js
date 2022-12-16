document.addEventListener("DOMContentLoaded", function () {
    var convertButton = document.getElementById("convert-button");
    var celsiusDegreesNumberInput = document.getElementById("celsius-degrees");
    var fahrenheitDegreesText = document.getElementById("fahrenheit-degrees");
    var kelvinDegreesText = document.getElementById("kelvin-degrees");
    var celsiusDegreesValue;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
    })

    function getFahrenheitDegrees(celsiusDegrees) {
        var coefficient = 1.8;
        var difference = 32;

        return celsiusDegrees * coefficient + difference;
    }

    function getKelvinDegrees(celsiusDegrees) {
        var difference = 273;

        return celsiusDegrees * 1.0 + difference;
    }

    convertButton.addEventListener("click", function () {
        celsiusDegreesNumberInput.classList.remove("invalid");

        if (celsiusDegreesNumberInput.value === "") {
            celsiusDegreesNumberInput.classList.add("invalid");

            return;
        }

        var celsiusDegrees = celsiusDegreesNumberInput.value;

        fahrenheitDegreesText.textContent = getFahrenheitDegrees(celsiusDegrees).toFixed(10);
        kelvinDegreesText.textContent = getKelvinDegrees(celsiusDegrees).toFixed(10);
    });

    celsiusDegreesNumberInput.addEventListener("keyup", function () {
        if (celsiusDegreesNumberInput.value !== celsiusDegreesValue) {
            celsiusDegreesValue = celsiusDegreesNumberInput.value;

            fahrenheitDegreesText.textContent = "";
            kelvinDegreesText.textContent = "";
        }
    });
});