import $ from "jquery";

function get(url, data) {
    return $.get(url, data)
}

function post(url, data) {
    return $.post({
        url,
        data: JSON.stringify(data),
        contentType: "application/json"
    });
}

export default class PhoneBookService {
    constructor() {
        this.baseUrl = "/api/";
    }

    getContacts(term) {
        return get(this.baseUrl + "getContacts", {term});
    }

    createContact(contact) {
        return post(this.baseUrl + "createContact", {contact});
    }

    deleteContact(contactsIdToDelete) {
        return post(this.baseUrl + "deleteContact", {contactsIdToDelete});
    }
}