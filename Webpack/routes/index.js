var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});*/

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

router.post("/api/deleteContacts", function (req, res) {
  var contactsIdsToDelete = req.body.contactsIdsToDelete;

  contacts = contacts.filter(function (c) {
    return !contactsIdsToDelete.some(function (id) {
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

  var responseInformation = {
    success: true,
    messages: [],
    errorsCodes: []
  }

  if (!contact) {
    responseInformation.success = false;
    responseInformation.errorsCodes.push(0);
    responseInformation.messages.push("Incorrect request format");

    res.send(responseInformation);
    return;
  }

  if (!contact.firstName) {
    responseInformation.success = false;
    responseInformation.errorsCodes.push(1);
    responseInformation.messages.push("Please, enter contact's first name");
  }

  if (!contact.lastName) {
    responseInformation.success = false;
    responseInformation.errorsCodes.push(2);
    responseInformation.messages.push("Please, enter contact's last name");
  }

  if (!contact.phoneNumber) {
    responseInformation.success = false;
    responseInformation.errorsCodes.push(3);
    responseInformation.messages.push("Please, enter contact's phone number");
  }

  if (contacts.some(function (c) {
    return c.phoneNumber.toUpperCase() === contact.phoneNumber.toUpperCase();
  })) {
    responseInformation.success = false;
    responseInformation.errorsCodes.push(4);
    responseInformation.messages.push("Contact's phone number already exists");
  }

  if (responseInformation.success === false){
    res.send(responseInformation);

    return;
  }

  contacts.push({
    id: newContactId,
    firstName: contact.firstName,
    lastName: contact.lastName,
    phoneNumber: contact.phoneNumber
  });

  newContactId++;

  res.send(responseInformation);
});

module.exports = router;
