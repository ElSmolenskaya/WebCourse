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

PhoneBookService.prototype.deleteContact = function (contactsIdToDelete) {
    return post(this.baseUrl + "deleteContact", {contactsIdToDelete: contactsIdToDelete});
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
        term: "",
        contactToDelete: null,
        areAllContactsChecked: false,
        service: new PhoneBookService()
    },

    created: function () {
        this.loadContacts(false);
    },

    methods: {
        getCheckedContacts: function () {
            return this.contacts.filter(function (contact) {
                return contact.isChecked
            }).map(function (contact) {
                return contact.id;
            });
        },

        loadContacts: function (checkContacts) {
            var self = this;

            this.service.getContacts(this.term).done(function (contacts) {
                var checkedContacts = [];

                if (checkContacts) {
                    checkedContacts = self.getCheckedContacts();
                }

                self.contacts = contacts;

                self.contacts.forEach(function (contact) {
                    self.$set(contact, "isChecked", false);
                });

                checkedContacts.forEach(function (id) {
                    self.contacts.filter(function (contact) {
                        return contact.id === id;
                    }).forEach(function (checkedContact) {
                        checkedContact.isChecked = true;
                    });
                });

                self.areAllContactsChecked = false;
            }).fail(function () {
                alert("Contact's list hasn't been loaded");
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
                    alert(response.message);
                    return;
                }

                self.loadContacts(true);

                self.firstName = "";
                self.lastName = "";
                self.phoneNumber = "";
            }).fail(function () {
                alert("Contact wasn't created");
            });
        },

        showDeleteContactConfirmation: function (contact) {
            this.contactToDelete = contact;

            var deleteConfirmationModal = new bootstrap.Modal(this.$refs.deleteConfirmDialog);
            deleteConfirmationModal.show();
        },

        deleteContact: function () {
            var self = this;

            var contactsToDelete = this.getCheckedContacts();

            if (contactsToDelete.length === 0) {
                contactsToDelete.push(this.contactToDelete.id);
            }

            this.service.deleteContact(contactsToDelete).done(function (response) {
                if (!response.success) {
                    alert(response.message);
                    return;
                }

                self.loadContacts(false);
            }).fail(function () {
                alert("Contacts weren't deleted");
            });
        },

        checkAllContacts: function () {
            var self = this;

            this.contacts.forEach(function (contact) {
                contact.isChecked = self.areAllContactsChecked;
            });
        },

        checkContact: function () {
            if (this.areAllContactsChecked) {
                this.areAllContactsChecked = false;
            }
        }
    }
});