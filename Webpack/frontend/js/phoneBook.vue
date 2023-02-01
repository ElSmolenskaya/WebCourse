<template>
  <div class="phonebook-container container p-3">
    <h1 class="text-center">Phonebook</h1>
    <div class="d-flex justify-content-center mb-4">
      <form @submit.prevent="createContact"
            id="form"
            class="create-contact-form needs-validation p-0"
            novalidate>
        <div class="input-group mb-1">
          <span class="input-group-text">First name</span>
          <input v-model="firstName"
                 :class="{'is-invalid': isFirstNameInvalid}"
                 type="text"
                 class="form-control">
          <div class="invalid-feedback">Field is required</div>
        </div>
        <div class="input-group mb-1">
          <span class="input-group-text">Last name</span>
          <input v-model="lastName"
                 :class="{'is-invalid': isLastNameInvalid}"
                 type="text"
                 class="form-control">
          <div class="invalid-feedback">Field is required</div>
        </div>
        <div class="input-group mb-1">
          <span class="input-group-text">Phone number</span>
          <input v-model="phoneNumber"
                 :class="{'is-invalid': isPhoneNumberInvalid}"
                 type="text"
                 class="form-control">
          <template v-if="isPhoneNumberExists">
            <div class="invalid-feedback">Contact's phone number already exists</div>
          </template>
          <template v-else>
            <div class="invalid-feedback">Field is required</div>
          </template>
        </div>
        <div class="d-flex justify-content-end p-0">
          <button class="add-button btn btn-primary mb-3" type="submit">Add</button>
        </div>
      </form>
    </div>
    <div class="d-flex justify-content-center mb-2">
      <form @submit.prevent="loadContacts"
            id="form"
            class="needs-validation p-0"
            novalidate>
        <div class="input-group mb-1">
          <span class="input-group-text">Search</span>
          <input v-model="term" type="text" class="form-control">
          <button class="search-button btn btn-primary" type="submit">Search</button>
        </div>
      </form>
    </div>
    <div class="table-responsive">
      <table class="table table-success table-striped table-bordered table-hover m-0">
        <thead>
        <tr class="table-light">
          <th scope="col" class="check-contact-column">
            <input class="form-check-input"
                   type="checkbox"
                   v-model="areAllContactsChecked"
                   @change="checkAllContacts">
          </th>
          <th scope="col">№</th>
          <th scope="col">Last name</th>
          <th scope="col">First name</th>
          <th scope="col">Phone number</th>
          <th scope="col" class="delete-contact-column">
            <button @click="showDeleteContactsConfirmationModal()"
                    type="button"
                    class="delete-button btn btn-danger"
                    title="Delete selected contacts">x
            </button>
          </th>
        </tr>
        </thead>
        <tbody v-cloak>
        <tr v-for="(contact, index) in contacts" :key="contact.id">
          <td>
            <input class="form-check-input"
                   type="checkbox"
                   v-model="contact.isChecked"
                   @change="checkContact">
          </td>
          <td>{{ index + 1 }}</td>
          <td v-text="contact.firstName"></td>
          <td v-text="contact.lastName"></td>
          <td v-text="contact.phoneNumber"></td>
          <td>
            <button @click="showDeleteContactsConfirmationModal(contact)"
                    type="button"
                    class="delete-button btn btn-danger"
                    title="Delete contact">x
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div ref="deleteConfirmDialog" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Deletion confirmation</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning" role="alert">
              <p>Do you really want to delete the contact(s)?</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button @click="deleteContacts"
                    data-bs-dismiss="modal"
                    type="button"
                    class="btn btn-primary">OK
            </button>
          </div>
        </div>
      </div>
    </div>
    <div ref="errorMessageDialog" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Error</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-danger" role="alert">
              <p v-text="errorMessage"></p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import PhoneBookService from "./phoneBookService";
import "bootstrap/dist/css/bootstrap.css";

export default {
  data() {
    return {
      contacts: [],
      firstName: "",
      isFirstNameInvalid: false,
      lastName: "",
      isLastNameInvalid: false,
      phoneNumber: "",
      isPhoneNumberInvalid: false,
      isPhoneNumberExists: false,
      term: "",
      contactsIdsToDelete: [],
      areAllContactsChecked: false,
      service: new PhoneBookService(),
      errorMessage: ""
    };
  },

  created() {
    this.loadContacts();
  },

  methods: {
    getCheckedContactsIds() {
      return this.contacts
          .filter(contact => contact.isChecked)
          .map(contact => contact.id);
    },

    loadContacts() {
      this.service.getContacts(this.term).done(contacts => {
        let checkedContactsIds = this.getCheckedContactsIds();

        contacts.forEach(contact => {
          contact.isChecked = false;
        });

        this.contacts = contacts;

        checkedContactsIds.forEach(id => {
          let contact = this.contacts.find(function (contact) {
            return contact.id === id;
          });

          if (contact) {
            contact.isChecked = true;
          }
        });

        this.areAllContactsChecked = false;
      }).fail(function () {
        this.showErrorMessageModal("Contact's list hasn't been loaded");
      });
    },

    createContact() {
      const newFirstName = this.firstName.trim();
      this.isFirstNameInvalid = newFirstName.length === 0;

      const newLastName = this.lastName.trim();
      this.isLastNameInvalid = newLastName.length === 0;

      const newPhoneNumber = this.phoneNumber.trim();
      this.isPhoneNumberInvalid = newPhoneNumber.length === 0;
      this.isPhoneNumberExists = false;

      if (!this.isPhoneNumberInvalid) {
        if (this.contacts.some(contact => contact.phoneNumber.toUpperCase() === newPhoneNumber.toUpperCase())) {
          this.isPhoneNumberExists = true;
          this.isPhoneNumberInvalid = true;

          return;
        }
      }

      if (this.isFirstNameInvalid || this.isLastNameInvalid || this.isPhoneNumberInvalid) {
        return;
      }

      const request = {
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber
      };

      this.service.createContact(request).done(response => {
        if (!response.success) {
          if (response.errorsCodes.includes(0)) {
            this.showErrorMessageModal(response.messages.join(", "));

            return;
          }

          if (response.errorsCodes.includes(1)) {
            this.isFirstNameInvalid = true;
          }

          if (response.errorsCodes.includes(2)) {
            this.isLastNameInvalid = true;
          }

          if (response.errorsCodes.includes(3)) {
            this.isNewPhoneNumberInvalid = true;
          }

          if (response.errorsCodes.includes(4)) {
            this.isPhoneNumberExists = true;
            this.isPhoneNumberInvalid = true;
          }

          return;
        }

        this.loadContacts();

        this.firstName = "";
        this.lastName = "";
        this.phoneNumber = "";
      }).fail(function () {
        this.showErrorMessageModal("Contact wasn't created");
      });
    },

    showErrorMessageModal(errorMessage) {
      this.errorMessage = errorMessage;

      const errorMessageModal = new bootstrap.Modal(this.$refs.errorMessageDialog);
      errorMessageModal.show();
    },

    showDeleteContactsConfirmationModal(contact) {
      if (contact) {
        this.contactsIdsToDelete.push(contact.id);
      } else {
        this.contactsIdsToDelete = this.getCheckedContactsIds();
      }

      if (this.contactsIdsToDelete.length === 0) {
        this.showErrorMessageModal("Contacts to delete weren't selected");

        return;
      }

      const deleteConfirmationModal = new bootstrap.Modal(this.$refs.deleteConfirmDialog);
      deleteConfirmationModal.show();
    },

    deleteContacts() {
      this.service.deleteContacts(this.contactsIdsToDelete).done(response => {
        if (!response.success) {
          this.showErrorMessageModal(response.message);
        }

        this.loadContacts();
      }).fail(function () {
        this.showErrorMessageModal("Contacts weren't deleted");
      });
    },

    checkAllContacts() {
      this.contacts.forEach(contact => {
        contact.isChecked = this.areAllContactsChecked;
      });
    },

    checkContact() {
      if (this.areAllContactsChecked) {
        this.areAllContactsChecked = false;
      }
    }
  }
}
</script>

<style>
[v-cloak] {
  display: none;
}

.phonebook-container {
  background-color: #afb1b3;
  font-family: Arial, sans-serif;
  color: #4b4a4a;
}

@media (min-width: 576px) {
  .phonebook-container form {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .phonebook-container form {
    width: 500px;
  }
}

.phonebook-container h1 {
  color: #f8fcfe;
}

.phonebook-container .input-group-text {
  min-width: 130px;
}

.add-button,
.search-button {
  color: #fdfeff;
  background-color: #3b98de;
  min-width: 80px
}

.create-contact-form .input-group {
  height: 60px;
}

.phonebook-container .input-group span,
.phonebook-container .input-group input,
.search-button,
.add-button {
  height: 35px;
}

.delete-button {
  padding: 0 8px;
}

.check-contact-column,
.delete-contact-column {
  width: 40px;
}
</style>