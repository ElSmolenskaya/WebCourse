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
        term: "",
        contactToDelete: null,
        contactsToDeleteId: [],
        isAllContactsChecked: false,
        service: new PhoneBookService()
    },

    created: function () {
        this.loadContacts();

        this.contacts.forEach(function (contact) {
            contact.isChecked = false;
        });
    },

    methods: {
        loadContacts: function () {
            var self = this;

            this.service.getContacts(this.term).done(function (contacts) {
                self.contacts = contacts;
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

                self.loadContacts();

                /*self.contactsIdToDelete.forEach(function (id) {
                    self.$set(self.contacts[id], "isChecked", true);
                });*/

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

            if (this.contactsIdToDelete.length === 0) {
                this.contactsIdToDelete.push(this.contactToDelete.id);
            }

            this.service.deleteContact(self.contactsIdToDelete).done(function (response) {
                if (!response.success) {
                    alert(response.message);
                    return;
                }

                self.loadContacts();

                self.isAllContactsChecked = false;
                self.contactsIdToDelete.clear();
            }).fail(function () {
                alert("Contacts weren't deleted");
            });
        },

        checkAllContacts: function () {
            var self = this;

            this.contacts.forEach(function (contact) {
                self.$set(contact, "isChecked", self.isAllContactsChecked);
            });

            if (this.isAllContactsChecked) {
                for (var i = 0; i < this.contacts.length; i++) {
                    this.contactsIdToDelete.push(this.contacts[i].id);
                }
            } else {
                this.contactsIdToDelete.clear();
            }
        },

        checkContact: function (contact) {
            if (this.isAllContactsChecked) {
                this.isAllContactsChecked = false;
            }

            if (contact.isChecked) {
                this.contactsIdToDelete.push(contact.id);
            } else {
                this.contactsIdToDelete = this.contactsIdToDelete.filter(function (c) {
                    return c !== contact.id;
                });
            }
        }
    }
});