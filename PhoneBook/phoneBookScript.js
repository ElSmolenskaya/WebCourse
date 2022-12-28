$(function () {
    var addButton = $("#add-button");
    var newFirstNameInput = $("#new-first-name");
    var newLastNameInput = $("#new-last-name");
    var newTelephoneNumberInput = $("#new-telephone-number");

    /*newTelephoneNumberInput.mask("+79999999999?9", {placeholder: ''});*/

    var phonebookTable = $("#phonebook-table");
    var form = $("#form");

    form.submit(function (e) {
        e.preventDefault();
    });

    addButton.click(function () {
        var newFirstNameText = newFirstNameInput.val().trim();
        newFirstNameInput.removeClass("invalid");

        var newLastNameText = newLastNameInput.val().trim();
        newLastNameInput.removeClass("invalid");

        var newTelephoneNumberText = newTelephoneNumberInput.val().trim();
        newTelephoneNumberInput.removeClass("invalid");

        var existsInvalidField = false;

        if (newFirstNameText.length === 0) {
            newFirstNameInput.addClass("invalid");

            existsInvalidField = true;
        }

        if (newLastNameText.length === 0) {
            newLastNameInput.addClass("invalid");

            existsInvalidField = true;
        }

        if (newTelephoneNumberText.length === 0) {
            newTelephoneNumberInput.addClass("invalid");

            existsInvalidField = true;
        }

        if (existsInvalidField) {
            return;
        }



    });
});