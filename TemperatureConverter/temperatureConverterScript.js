document.addEventListener("DOMContentLoaded", function () {
    var temperatureConverterForm = document.getElementById("form");
    var convertButton = document.getElementById("convert-button");
    var celsiusValueInput = document.getElementById("celsius-value");
    var fahrenheitValueText = document.getElementById("fahrenheit-value");
    var kelvinValueText = document.getElementById("kelvin-value");
    var errorMessageText = document.getElementById("error-message");
    var celsiusValue;

    temperatureConverterForm.addEventListener("submit", function (e) {
        e.preventDefault();
    });

    function getFahrenheitDegrees(celsiusValue) {
        return celsiusValue * 1.8 + 32;
    }

    function getKelvin(celsiusValue) {
        return celsiusValue * 1.0 + 273.15;
    }

    convertButton.addEventListener("click", function () {
        celsiusValueInput.classList.remove("invalid");

        var celsiusValue = celsiusValueInput.value.trim().replaceAll(",", ".");

        if (celsiusValue === "") {
            celsiusValueInput.classList.add("invalid");
            errorMessageText.textContent = "Field is required";

            return;
        }

        if (Number.isNaN(+celsiusValue)) {
            celsiusValueInput.classList.add("invalid");
            errorMessageText.textContent = "Incorrect value";

            return;
        }

        fahrenheitValueText.textContent = getFahrenheitDegrees(celsiusValue).toFixed(10);
        kelvinValueText.textContent = getKelvin(celsiusValue).toFixed(10);
    });

    celsiusValueInput.addEventListener("keyup", function () {
        if (celsiusValueInput.value !== celsiusValue) {
            celsiusValue = celsiusValueInput.value;

            fahrenheitValueText.textContent = "";
            kelvinValueText.textContent = "";
        }
    });
});