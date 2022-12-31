$(function () {
    var addButton = $("#add-button");
    var newFirstNameInput = $("#new-first-name");
    var newLastNameInput = $("#new-last-name");
    var newTelephoneNumberInput = $("#new-telephone-number");
    var contacts = [];

    var contactsTable = $("#contacts-table-body");
    var form = $("#form");

    form.submit(function (e) {
        e.preventDefault();
    });

    function printTable() {
        var contactNumber = 1;

        contactsTable.html("");

        contacts.forEach(function (contact) {
            addContact(contact, contactNumber);

            ++contactNumber;
        });
    }

    function addContact(contact, contactNumber) {
        var contactItem = $("<tr>");

        contactItem.html("<td>" + contactNumber + "</td><td>" + contact.lastName + "</td><td>" +
            contact.firstName + "</td><td>" + contact.telephoneNumber +
            "</td><td><button class='delete-button' type='button'>x</button></td>");

        var deleteButton = contactItem.find(".delete-button");

        deleteButton.click(function () {
            contactItem.html("");

            contacts.splice(contactNumber - 1, 1);

            printTable();
        });

        contactsTable.append(contactItem);
    }

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

        var contact = {
            firstName: newFirstNameText,
            lastName: newLastNameText,
            telephoneNumber: newTelephoneNumberText
        }

        contacts.push(contact);

        addContact(contact, contacts.length);

        newFirstNameInput.val("");
        newLastNameInput.val("");
        newTelephoneNumberInput.val("");
    });
});