new Vue({
    el: "#app",

    data: {
        contacts: [],
        newFirstNameText: "",
        isNewFirstNameInvalid: false,
        newLastNameText: "",
        isNewLastNameInvalid: false,
        newPhoneNumberText: "",
        isNewPhoneNumberInvalid: false,
        contactToDeleteIndex: -1,
        contactId: 1
    },

    methods: {
        addContact: function () {
            var newFirstName = this.newFirstNameText.trim();
            this.isNewFirstNameInvalid = newFirstName.length === 0;

            var newLastName = this.newLastNameText.trim();
            this.isNewLastNameInvalid = newLastName.length === 0;

            var newPhoneNumber = this.newPhoneNumberText.trim();
            this.isNewPhoneNumberInvalid = newPhoneNumber.length === 0;

            if (this.isNewFirstNameInvalid || this.isNewLastNameInvalid || this.isNewPhoneNumberInvalid) {
                return;
            }

            var isExists = false;

            this.contacts.forEach(function (contact) {
                if (contact.phoneNumber === newPhoneNumber) {
                    isExists = true;

                    alert("Phone number " + newPhoneNumber + " is already exists!");

                    return false;
                }
            });

            if (isExists) {
                return;
            }

            this.contacts.push({
                id: this.contactId,
                firstName: newFirstName,
                lastName: newLastName,
                phoneNumber: newPhoneNumber
            });

            this.contactId++;
            this.newFirstNameText = "";
            this.newLastNameText = "";
            this.newPhoneNumberText = "";
        },

        showDeleteContactConfirmation: function (contactToDeleteIndex) {
            this.contactToDeleteIndex = contactToDeleteIndex;

            var deleteConfirmationModal = new bootstrap.Modal(this.$refs.deleteConfirmDialog);
            deleteConfirmationModal.show();
        },

        deleteContact: function () {
            this.contacts.splice(this.contactToDeleteIndex, 1);
        }
    }
});