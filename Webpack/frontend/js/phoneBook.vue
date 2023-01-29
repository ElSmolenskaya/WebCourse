<template>
  <div class="phonebook-container container p-3">
    <h1 class="text-center">Phonebook</h1>
    <div class="d-flex justify-content-center mb-4">
      <form @submit.prevent="createContact"
            id="form"
            class="create-contact-form needs-validation container p-0"
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
            <div class="invalid-feedback">Phone number is already exists</div>
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
      <form @submit.prevent="loadContacts(true)"
            id="form"
            class="needs-validation container p-0"
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
          <th scope="col" class="delete-contact-column"></th>
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
            <button @click="showDeleteContactConfirmationModal(contact)" type="button"
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
            <p>Do you really want to delete the contact(s)?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button @click="deleteContact" data-bs-dismiss="modal" type="button"
                    class="btn btn-primary">OK
            </button>
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
      contactToDelete: null,
      areAllContactsChecked: false,
      service: new PhoneBookService()
    };
  },

  created() {
    this.loadContacts(false);
  },

  methods: {
    getCheckedContacts() {
      return this.contacts
          .filter(contact => contact.isChecked)
          .map(contact => contact.id);
    },

    loadContacts(checkContacts) {
      this.service.getContacts(this.term).done(contacts => {
        let checkedContacts = [];

        if (checkContacts) {
          checkedContacts = this.getCheckedContacts();
        }

        this.contacts = contacts;

        this.contacts.forEach(contact => {
          this.$set(contact, "isChecked", false);
        });

        checkedContacts.forEach(id => {
          this.contacts
              .filter(contact => contact.id === id)
              .forEach(checkedContact => {
                checkedContact.isChecked = true;
              });
        });

        this.areAllContactsChecked = false;
      }).fail(function () {
        alert("Contact's list hasn't been loaded");
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
          alert(response.message);
          return;
        }

        this.loadContacts(true);

        this.firstName = "";
        this.lastName = "";
        this.phoneNumber = "";
      }).fail(function () {
        alert("Contact wasn't created");
      });
    },

    showDeleteContactConfirmationModal(contact) {
      this.contactToDelete = contact;

      const deleteConfirmationModal = new bootstrap.Modal(this.$refs.deleteConfirmDialog);
      deleteConfirmationModal.show();
    },

    deleteContact() {
      let contactsToDelete = this.getCheckedContacts();

      if (contactsToDelete.length === 0) {
        contactsToDelete.push(this.contactToDelete.id);
      }

      this.service.deleteContact(contactsToDelete).done(response => {
        if (!response.success) {
          alert(response.message);
          return;
        }

        this.loadContacts(false);
      }).fail(function () {
        alert("Contacts weren't deleted");
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