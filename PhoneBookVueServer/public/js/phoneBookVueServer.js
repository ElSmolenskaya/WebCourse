Vue.component("base-checkbox", {
    model: {
        prop: "checked",
        event: "change"
    },
    props: {
        checked: Boolean
    },
    template: `
    <input
      type="checkbox"
      class="form-check-input"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >  `
});

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

PhoneBookService.prototype.deleteContact = function (id) {
    return post(this.baseUrl + "deleteContact", {id: id});
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
        isAllContactsChecked: false,
        service: new PhoneBookService()
    },

    created: function () {
        this.loadContacts();

        this.contacts.forEach(function (contact) {
            contact.checked = this.isAllContactsChecked;
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

            this.service.deleteContact(this.contactToDelete.id).done(function (response) {
                if (!response.success) {
                    alert(response.message);
                    return;
                }

                self.loadContacts();
            }).fail(function () {
                alert("Contact wasn't deleted");
            });
        },

        checkAllContacts: function () {
            console.log("this.isAllContactsChecked=" + this.isAllContactsChecked);

            this.contacts.forEach(function (contact) {
                contact.checked = this.isAllContactsChecked;
                console.log(contact.checked);
            });
        }
    }
});