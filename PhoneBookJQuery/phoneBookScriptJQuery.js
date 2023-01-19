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

    function addContact(contact, contactNumber) {
        var contactItem = $("<tr>");

        contactItem.html("<td class='contact-number'></td><td class='last-name'></td>\
            <td class='first-name'></td><td class='phone-number'></td><td class='delete-column'>\
            <button class='delete-button' type='button' title='Delete contact'>x</button></td>"
        );

        contactItem.find(".contact-number").text(contactNumber);
        contactItem.find(".last-name").text(contact.lastName);
        contactItem.find(".first-name").text(contact.firstName);
        contactItem.find(".phone-number").text(contact.phoneNumber);

        var deleteButton = contactItem.find(".delete-button");

        deleteButton.click(function () {
            contactItem.remove();

            var contactsNumbers = contactsTable.find(".contact-number");

            contactsNumbers.each(function (i) {
                $(this).text(i + 1);
            });

            contactsCount--;
        });

        contactsTable.append(contactItem);
    }

    addButton.click(function () {
        var newFirstNameText = newFirstNameInput.val().trim();
        newFirstNameInput.removeClass("invalid");

        var newLastNameText = newLastNameInput.val().trim();
        newLastNameInput.removeClass("invalid");

        var newPhoneNumberText = newPhoneNumberInput.val().trim();
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