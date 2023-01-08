$(function () {
    var addButton = $("#add-button");
    var newFirstNameInput = $("#new-first-name");
    var newLastNameInput = $("#new-last-name");
    var newPhoneNumberInput = $("#new-phone-number");

    var contactsTable = $("#contacts-table-body");
    var form = $("#form");
    var contactsCount = 0;

    form.submit(function (e) {
        e.preventDefault();
    });

    function deleteTags(string) {
        return string.replace(/<\/?[a-zA-Z]+>/gi, "");
    }

    function addContact(contact, contactNumber) {
        var contactItem = $("<tr>");

        contactItem.html("<th scope='row' class='contact-number'>" + contactNumber + "</th><td>" + contact.lastName +
            "</td><td>" + contact.firstName + "</td><td class='phone-number'>" + contact.phoneNumber +
            "</td><td><button class='delete-button' type='button'>x</button></td>");

        var deleteButton = contactItem.find(".delete-button");

        deleteButton.click(function () {
            contactItem.html("");

            var contactsNumbers = contactsTable.find(".contact-number");

            contactsNumbers.each(function (i) {
                $(this).text(i + 1);
            });

            contactsCount--;
        });

        contactsTable.append(contactItem);
    }

    addButton.click(function () {
        var newFirstNameText = deleteTags(newFirstNameInput.val().trim());
        newFirstNameInput.removeClass("invalid");

        var newLastNameText = deleteTags(newLastNameInput.val().trim());
        newLastNameInput.removeClass("invalid");

        var newPhoneNumberText = deleteTags(newPhoneNumberInput.val().trim());
        newPhoneNumberInput.removeClass("invalid");

        var isInvalid = false;

        if (newFirstNameText.length === 0) {
            newFirstNameInput.addClass("invalid");

            isInvalid = true;
        }

        if (newLastNameText.length === 0) {
            newLastNameInput.addClass("invalid");

            isInvalid = true;
        }

        if (newPhoneNumberText.length === 0) {
            newPhoneNumberInput.addClass("invalid");

            isInvalid = true;
        }

        if (isInvalid) {
            return;
        }

        var phoneNumbers = contactsTable.find(".phone-number");
        var isExists = false;

        phoneNumbers.each(function () {
            if ($(this).text() === newPhoneNumberText) {
                isExists = true;

                alert("Phone number " + newPhoneNumberText + " is already exists!");

                return false;
            }
        });

        if (isExists) {
            return;
        }

        var contact = {
            firstName: newFirstNameText,
            lastName: newLastNameText,
            phoneNumber: newPhoneNumberText
        };

        contactsCount++;

        addContact(contact, contactsCount);

        newFirstNameInput.val("");
        newLastNameInput.val("");
        newPhoneNumberInput.val("");
    });
});