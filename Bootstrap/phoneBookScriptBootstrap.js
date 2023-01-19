$(function () {
    var addButton = $("#add-button");
    var newFirstNameInput = $("#new-first-name");
    var newLastNameInput = $("#new-last-name");
    var newPhoneNumberInput = $("#new-phone-number");
    var phoneNumberErrorText = $("#phone-number-error-text");
    var contactsTable = $("#contacts-table-body");
    var form = $("#form");
    var deleteConfirmationModal = new bootstrap.Modal($("#deleteConfirmDialog"));
    var deleteConfirmationButton = $("#delete-confirmation-button");

    var contactsCount = 0;
    var deletingContactItem;

    form.submit(function (e) {
        e.preventDefault();
    });

    deleteConfirmationButton.click(function () {
        deletingContactItem.remove();

        var contactsNumbers = contactsTable.find(".contact-number");

        contactsNumbers.each(function (i) {
            $(this).text(i + 1);
        });

        contactsCount--;
        console.log(contactsCount);
    });

    function addContact(contact, contactNumber) {
        var contactItem = $("<tr>");

        contactItem.html("<th scope='row' class='contact-number'></th><td class='last-name'></td>\
            <td class='first-name'></td><td class='phone-number'></td><td class='delete-column'>\
            <button type='button' class='delete-button btn btn-danger' title='Delete contact'>x</button></td>"
        );

        contactItem.find(".contact-number").text(contactNumber);
        contactItem.find(".last-name").text(contact.lastName);
        contactItem.find(".first-name").text(contact.firstName);
        contactItem.find(".phone-number").text(contact.phoneNumber);

        var deleteButton = contactItem.find(".delete-button");

        deleteButton.click(function () {
            deletingContactItem = contactItem;

            deleteConfirmationModal.show();
        });

        contactsTable.append(contactItem);
    }

    addButton.click(function () {
        var newFirstNameText = newFirstNameInput.val().trim();
        newFirstNameInput.removeClass("is-invalid");

        var newLastNameText = newLastNameInput.val().trim();
        newLastNameInput.removeClass("is-invalid");

        var newPhoneNumberText = newPhoneNumberInput.val().trim();
        newPhoneNumberInput.removeClass("is-invalid");

        var isInvalid = false;

        if (newFirstNameText.length === 0) {
            newFirstNameInput.addClass("is-invalid");

            isInvalid = true;
        }

        if (newLastNameText.length === 0) {
            newLastNameInput.addClass("is-invalid");

            isInvalid = true;
        }

        if (newPhoneNumberText.length === 0) {
            phoneNumberErrorText.text("Field is required");
            newPhoneNumberInput.addClass("is-invalid");

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

                phoneNumberErrorText.text("Phone number is already exists");
                newPhoneNumberInput.addClass("is-invalid");

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