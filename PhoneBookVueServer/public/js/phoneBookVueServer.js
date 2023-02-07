function get(url, data) {
    return $.get(url, data)
}

function post(url, data) {
    return $.post({
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json"
    });
}

function PhoneBookService() {
}

PhoneBookService.prototype.baseUrl = "/api/";

PhoneBookService.prototype.getContacts = function (term) {
    return get(this.baseUrl + "getContacts", {term: term});
};

PhoneBookService.prototype.createContact = function (contact) {
    return post(this.baseUrl + "createContact", {contact: contact});
};

PhoneBookService.prototype.deleteContacts = function (contactsIdsToDelete) {
    return post(this.baseUrl + "deleteContacts", {contactsIdsToDelete: contactsIdsToDelete});
};

new Vue({
    el: "#app",

    data: {
        contacts: [],
        firstName: "",
        isFirstNameInvalid: false,
        lastName: "",
        isLastNameInvalid: false,
        phoneNumber: "",
        isPhoneNumberInvalid: false,
        isPhoneNumberExists: false,
        areContactsSelected: false,
        term: "",
        contactsIdsToDelete: [],
        areAllContactsChecked: false,
        service: new PhoneBookService(),
        errorMessage: "",
        confirmationMessage: ""
    },

    created: function () {
        this.loadContacts();
    },

    methods: {
        getCheckedContactsIds: function () {
            return this.contacts.filter(function (contact) {
                return contact.isChecked;
            }).map(function (contact) {
                return contact.id;
            });
        },

        loadContacts: function () {
            var self = this;

            this.service.getContacts(this.term).done(function (contacts) {
                var checkedContactsIds = self.getCheckedContactsIds();

                contacts.forEach(function (contact) {
                    contact.isChecked = false;
                });

                self.contacts = contacts;
                self.areContactsSelected = false;

                checkedContactsIds.forEach(function (id) {
                    var contact = self.contacts.find(function (contact) {
                        return contact.id === id;
                    });

                    if (contact) {
                        contact.isChecked = true;
                        self.areContactsSelected = true;
                    }
                });

                self.areAllContactsChecked = false;
            }).fail(function () {
                self.showErrorMessageModal("Contact's list hasn't been loaded");
            });
        },

        createContact: function () {
            var self = this;

            var newFirstName = this.firstName.trim();
            this.isFirstNameInvalid = newFirstName.length === 0;

            var newLastName = this.lastName.trim();
            this.isLastNameInvalid = newLastName.length === 0;

            var newPhoneNumber = this.phoneNumber.trim();
            this.isPhoneNumberInvalid = newPhoneNumber.length === 0;
            this.isPhoneNumberExists = false;

            if (!this.isPhoneNumberInvalid) {
                if (this.contacts.some(function (contact) {
                    return contact.phoneNumber.toUpperCase() === newPhoneNumber.toUpperCase();
                })) {
                    this.isPhoneNumberExists = true;
                    this.isPhoneNumberInvalid = true;

                    return;
                }
            }

            if (this.isFirstNameInvalid || this.isLastNameInvalid || this.isPhoneNumberInvalid) {
                return;
            }

            var request = {
                firstName: this.firstName,
                lastName: this.lastName,
                phoneNumber: this.phoneNumber
            };

            this.service.createContact(request).done(function (response) {
                if (!response.success) {
                    if (response.errorsCodes.includes(0)) {
                        self.showErrorMessageModal(response.messages.join(", "));

                        return;
                    }

                    if (response.errorsCodes.includes(1)) {
                        self.isFirstNameInvalid = true;
                    }

                    if (response.errorsCodes.includes(2)) {
                        self.isLastNameInvalid = true;
                    }

                    if (response.errorsCodes.includes(3)) {
                        self.isNewPhoneNumberInvalid = true;
                    }

                    if (response.errorsCodes.includes(4)) {
                        self.isPhoneNumberExists = true;
                        self.isPhoneNumberInvalid = true;
                    }

                    return;
                }

                self.loadContacts();

                self.firstName = "";
                self.lastName = "";
                self.phoneNumber = "";
            }).fail(function () {
                self.showErrorMessageModal("Contact wasn't created");
            });
        },

        showErrorMessageModal: function (errorMessage) {
            this.errorMessage = errorMessage;

            var errorMessageModal = new bootstrap.Modal(this.$refs.errorMessageDialog);
            errorMessageModal.show();
        },

        showDeleteContactsConfirmationModal: function (contact) {
            if (contact) {
                this.contactsIdsToDelete.splice(0, this.contactsIdsToDelete.length, contact.id);
                this.confirmationMessage = "Do you really want to delete the contact?";
            } else {
                this.contactsIdsToDelete = this.getCheckedContactsIds();

                this.confirmationMessage = this.contactsIdsToDelete.length === 1
                    ? "Do you really want to delete selected contact?"
                    : "Do you really want to delete selected contacts?";
            }

            var deleteConfirmationModal = new bootstrap.Modal(this.$refs.deleteConfirmDialog);
            deleteConfirmationModal.show();
        },

        deleteContacts: function () {
            var self = this;

            this.service.deleteContacts(this.contactsIdsToDelete).done(function (response) {
                if (!response.success) {
                    self.showErrorMessageModal(response.message);

                    return;
                }

                self.loadContacts();
            }).fail(function () {
                self.showErrorMessageModal("Contacts weren't deleted");
            });
        },

        checkAllContacts: function () {
            var self = this;

            this.contacts.forEach(function (contact) {
                contact.isChecked = self.areAllContactsChecked;
            });

            this.areContactsSelected = this.getCheckedContactsIds().length > 0;
        },

        checkContact: function () {
            if (this.areAllContactsChecked) {
                this.areAllContactsChecked = false;
            }

            this.areContactsSelected = this.getCheckedContactsIds().length > 0;
        }
    }
});