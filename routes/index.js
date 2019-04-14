var express = require('express');
var router = express.Router();

var Person = require('../classes/Person');
var Organisation = require('../classes/Organisation');

var Helper = require('../classes/Helpers');

//Used for reading/writing JSON data
var fs = require('fs');

//Arrays
var people = Helper.loadPeople(fs);
var organisations = Helper.loadOrganisations(fs);

//// GET requests

router.get('/', function(req, res) {
  var peopleJSON = JSON.stringify(people);
  var organisationsJSON = JSON.stringify(organisations);

  res.render('layout', { title: 'Address Book',
            people:peopleJSON, organisations:organisationsJSON });
});


//// POST requests

router.post('/create/person', function(req, res) {
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  var orgID = req.body.orgID;

  //Create and add new person to array
  var newPerson = new Person(name,phone,email,orgID);
  people.push(newPerson);

  //Save changes
  Helper.savePeople(people,fs);

  //Prepare response
  response = { "people": people, "newPerson": newPerson };
  response = JSON.stringify(response);

  res.end(response);
});

router.post('/create/organisation', function(req, res) {
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;

  //Create and add new organisation to array
  var newOrganisation = new Organisation(name,phone,email);
  organisations.push(newOrganisation);

  //Save changes
  Helper.saveOrganisations(organisations,fs);

  //Prepare response
  response = { "organisations": organisations, "newOrganisation": newOrganisation };
  response = JSON.stringify(response);

  res.end(response);
});

router.post('/edit/person', function(req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  var orgID = req.body.orgID;

  //Find and edit person
  var personToEdit = Helper.getObject(people, id);
  personToEdit.edit(name,phone,email,orgID);

  //Save changes
  Helper.savePeople(people,fs);

  //Prepare response
  response = { "people": people };
  response = JSON.stringify(response);

  res.end(response);
});

router.post('/edit/organisation', function(req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;

  //Find and edit organisation;
  var organisationToEdit = Helper.getObject(organisations, id);
  organisationToEdit.edit(name,phone,email);

  //Save changes
  Helper.saveOrganisations(organisations,fs);

  //Prepare response
  response = { "organisations": organisations };
  response = JSON.stringify(response);

  res.end(response);
});

router.post('/remove/person', function(req, res) {
  var id = req.body.id;
  Helper.removeObject(people, id);

  //Save changes
  Helper.savePeople(people,fs);

  //Prepare response
  response = { "people": people };
  response = JSON.stringify(response);

  res.end(response);
});

router.post('/remove/organisation', function(req, res) {
  var id = req.body.id;
  Helper.removeObject(organisations, id);

  people = Helper.removePeopleInOrganisation(people, id);

  //Save changes
  Helper.saveOrganisations(organisations,fs);
  Helper.savePeople(people,fs);

  //Prepare response
  response = { "people": people, "organisations":organisations };
  response = JSON.stringify(response);
  res.end(response);
});


module.exports = router;
