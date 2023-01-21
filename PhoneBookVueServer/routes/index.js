var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

var contacts = [];
var newContactId = 1;

router.get("/api/getContacts", function (req, res) {
    var term = (req.query.term || "").toUpperCase();

    var filteredContacts = term.length === 0
        ? contacts
        : contacts.filter(function (c) {
            return c.firstName.toUpperCase().includes(term) || c.lastName.toUpperCase().includes(term) || c.phoneNumber.toUpperCase().includes(term);
        });

    res.send(filteredContacts);
});

router.post("/api/deleteContact", function (req, res) {
    var contactsIdToDelete = req.body.contactsIdToDelete;

    contacts = contacts.filter(function (c) {
        return !contactsIdToDelete.some(function (id) {
            return c.id === id
        });
    });

    res.send({
        success: true,
        message: null
    });
});

router.post("/api/createContact", function (req, res) {
    var contact = req.body.contact;

    if (!contact) {
        res.send({
            success: false,
            message: "Incorrect request format"
        });

        return;
    }

    if (!contact.firstName) {
        res.send({
            success: false,
            message: "Please, enter contact's first name"
        });

        return;
    }

    if (!contact.lastName) {
        res.send({
            success: false,
            message: "Please, enter contact's last name"
        });

        return;
    }

    if (!contact.phoneNumber) {
        res.send({
            success: false,
            message: "Please, enter contact's phone number"
        });

        return;
    }

    if (contacts.some(function (c) {
        return c.phoneNumber.toUpperCase() === contact.phoneNumber.toUpperCase();
    })) {
        res.send({
            success: false,
            message: "Contact's phone number already exists "
        });

        return;
    }

    contacts.push({
        id: newContactId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber
    });

    newContactId++;

    res.send({
        success: true,
        message: null
    });
});

module.exports = router;