var organisations = [];
var people = [];

$(document).ready(function() {
  //Add click handler to the 'all' organisations button
  $("#allOrganisations").click(organisationClickHandler);
  $('.fixed-action-btn').floatingActionButton();
  $('.tooltipped').tooltip();

  populatePersonModalOptions();

  $('#addPersonModal').modal();
  $('#addOrganisationModal').modal();
  $('#editPersonModal').modal();
  $('#editOrganisationModal').modal();

  $("#addOrganisationSubmit").click(submitOrganisation);
  $("#addPersonSubmit").click(submitPerson);
  $("#editOrganisationSubmit").click(submitEditOrganisation);
  $("#editPersonSubmit").click(submitEditPerson);

  $('#addPersonBtn').click(addPersonModal);
  $('#addOrganisationBtn').click(addOrganisationModal);
});

//Data will be passed in as JSON on load
function loadData(organisations, people){
  this.organisations = JSON.parse(organisations);
  this.people = JSON.parse(people);

  //Populate data
  for(var i = 0; i < this.organisations.length; i++){
    var orgID = this.organisations[i].ID;
    createOrganisation(orgID);
  }

  populatePeople('all');

}

// Creates and displays organisation element in view
function createOrganisation(id){
  var organisation = this.organisations.find(x => x.ID == id);
  var name = organisation.name;
  var htmlString = `
  <li class="collection-item scale-transition scale-out"
  data-id="`+id+`">
    <p id="organisationName" class="primary-content">`+name+`</p>
    <div class="secondary-content valign-wrapper">
      <a href="#!" class="editBtn"><i class="material-icons">create</i></a>
      <a href="#!" class="removeBtn"><i class="material-icons">cancel</i></a>
    </div>
  </li>`;

  $('#organisationHolder').append(htmlString);

  var newOrganisationElem = $('#organisationHolder').children().last();
  newOrganisationElem.click(organisationClickHandler);

  newOrganisationElem.find(".editBtn").first().click(editOrganisationModal);
  newOrganisationElem.find(".removeBtn").first().click(removeOrganisation);

  //Run scale-in animation provided by materializecss
  setTimeout(function(){
    newOrganisationElem.addClass('scale-in');
  }, 100);
}

// Creates and displays person element in view
function createPerson(id){
  var person = this.people.find(x => x.ID == id);
  var name = person.name;
  var organisationID = person.orgID;

  var organisation = this.organisations.find(x => x.ID == organisationID);
  var organisationName = organisation.name;

  var htmlString = `
  <li class="collection-item avatar scale-transition scale-out"
  data-id="`+id+`" data-orgid="`+organisationID+`">
    <div class="primary-content" id="peopleContent">
      <img src="../public/res/person.png" alt="" class="circle">

      <p id="peopleName" >`+name+`</p>
      <br>
      <p id="peopleOrgName">`+organisationName+`</p>
    </div>
    <div class="secondary-content valign-wrapper">
      <a href="#!" class="editBtn"><i class="material-icons">create</i></a>
      <a href="#!" class="removeBtn"><i class="material-icons">cancel</i></a>
    </div>
  </li>`

  $('#peopleHolder').append(htmlString);

  //Add click listeners
  var newPersonElem = $('#peopleHolder').children().last();
  newPersonElem.click(personClickHandler);

  newPersonElem.find(".editBtn").first().click(editPersonModal);
  newPersonElem.find(".removeBtn").first().click(removePerson);

  //Run scale-in animation provided by materializecss
  setTimeout(function(){
    newPersonElem.addClass('scale-in');
  }, 100);
}

// Sends remove person request to server
function removePerson(e) {
  var person = $(e.target).parents(".collection-item").first();

  var req = {
    id: person.data("id")
  }

  $.post( "/remove/person",req, function(res) {
    //Update people array
    response = JSON.parse(res);
    people = response.people;

    $("#personHolder").hide();

    //Remove person from view
    person.removeClass("scale-in");
    setTimeout(function(){
      person.remove();
    }, 200);
  });
}

// Sends remove organisation request to server
function removeOrganisation(e) {
  var organisation = $(e.target).parents(".collection-item").first();

  var req = {
    id: organisation.data("id")
  }

  $.post( "/remove/organisation",req, function(res) {
    //Update people and organisations arrays
    response = JSON.parse(res);
    organisations = response.organisations;
    people = response.people;

    //Remove organisation from view
    organisation.removeClass("scale-in");
    setTimeout(function(){
      organisation.remove();
    }, 200);

    populatePersonModalOptions();
    $("#allOrganisations").click();
  });
}

// Sends new person details to server to be created
function submitPerson(){
  var valid = $("#form_add_person_name").hasClass('valid') &&
              $("#form_add_person_email").hasClass('valid') &&
              $("#form_add_person_phone").hasClass('valid') &&
              $("#form_add_person_organisation").val() != null;

  if(!valid){
    M.toast({html: 'Input is not valid'});
    return;
  }

  var req = {
    name: $("#form_add_person_name").val(),
    email: $("#form_add_person_email").val(),
    phone: $("#form_add_person_phone").val(),
    orgID: $("#form_add_person_organisation").val()
  }

  $.post( "/create/person",req, function(res) {
    //Parse response and add new person to page
    response = JSON.parse(res);
    newPerson = response.newPerson;
    people = response.people;

    //Go back to All view where new person is added
    //Means person is not shown to be in an organisation they are not
    $("#allOrganisations").click();
  });
}

// Sends new organisation details to server to be created
function submitOrganisation(){
  var valid = $("#form_add_organisation_name").hasClass('valid') &&
              $("#form_add_organisation_email").hasClass('valid') &&
              $("#form_add_organisation_phone").hasClass('valid');

  if(!valid){
    M.toast({html: 'Input is not valid'});
    return;
  }

  var req = {
    name: $("#form_add_organisation_name").val(),
    email: $("#form_add_organisation_email").val(),
    phone: $("#form_add_organisation_phone").val()
  }

  $.post( "/create/organisation",req, function(res) {
    //Parse response and add new organisation to page
    response = JSON.parse(res);
    newOrganisation = response.newOrganisation;
    organisations = response.organisations;

    createOrganisation(newOrganisation.ID);

    populatePersonModalOptions();
  });
}

// Sends person edits to server
function submitEditPerson(){
  var valid = $("#form_edit_person_name").hasClass('valid') &&
              $("#form_edit_person_email").hasClass('valid') &&
              $("#form_edit_person_phone").hasClass('valid') &&
              $("#form_edit_person_organisation").val() != null;

  if(!valid){
    M.toast({html: 'Input is not valid'});
    return;
  }

  var req = {
    id: $("#form_edit_person_id").val(),
    name: $("#form_edit_person_name").val(),
    email: $("#form_edit_person_email").val(),
    phone: $("#form_edit_person_phone").val(),
    orgID: $("#form_edit_person_organisation").val()
  }

  $.post( "/edit/person",req, function(res) {
    response = JSON.parse(res);
    people = response.people;

    var organisation = organisations.find(x => x.ID == req.orgID);
    var organisationName = organisation.name;

    var personElem = $("#peopleHolder").find('[data-id="'+req.id+'"]');
    personElem.find("#peopleName").text(req.name);
    personElem.find("#peopleOrgName").text(organisationName);

    $(personElem).click();
  });
}

// Sends organisation edits to server
function submitEditOrganisation(){
  var valid = $("#form_edit_organisation_name").hasClass('valid') &&
              $("#form_edit_organisation_email").hasClass('valid') &&
              $("#form_edit_organisation_phone").hasClass('valid');

  if(!valid){
    M.toast({html: 'Input is not valid'});
    return;
  }

  var req = {
    id: $("#form_edit_organisation_id").val(),
    name: $("#form_edit_organisation_name").val(),
    email: $("#form_edit_organisation_email").val(),
    phone: $("#form_edit_organisation_phone").val()
  }

  $.post( "/edit/organisation",req, function(res) {
    response = JSON.parse(res);
    organisations = response.organisations;

    var organisationElem = $("#organisationHolder").find('[data-id="'+req.id+'"]');
    organisationElem.find("#organisationName").text(req.name);

    $("#personHolder").hide();
    $(organisationElem).click();

    populatePersonModalOptions();
  });
}

//Displays people in selected organisation in view
function populatePeople(organisationID){
  //Clear people column
  $("#peopleHolder").empty();

  var peopleToPopulate = this.people;
  if(organisationID != "all"){
    peopleToPopulate = this.people.filter(x => x.orgID == organisationID);
  }

  for(var i = 0; i < peopleToPopulate.length; i++){
    var personID = peopleToPopulate[i].ID;
    createPerson(personID);
  }
}

//Displays details of selected person in view
function populatePerson(personID){
  $("#personHolder").hide();
  clearPerson();

  var person = people.find(x => x.ID == personID);
  var personOrg = organisations.find(x => x.ID == person.orgID);

  $("#personName").text(person.name);
  $("#personOrganisationName").text(personOrg.name);

  $("#personEmail").append(person.email);
  $("#personPhone").append(person.phone);
  $("#personOrganisationEmail").append(personOrg.email);
  $("#personOrganisationPhone").append(personOrg.phone);

  $("#personHolder").show();
}

//Clears person view (preserves icons)
function clearPerson(){
  $("#personEmail").html($("#personEmail").find('.material-icons').get(0).outerHTML + " ");
  $("#personPhone").html($("#personPhone").find('.material-icons').get(0).outerHTML + " ");
  $("#personOrganisationEmail").html($("#personOrganisationEmail").find('.material-icons').get(0).outerHTML + " ");
  $("#personOrganisationPhone").html($("#personOrganisationPhone").find('.material-icons').get(0).outerHTML + " ");
}

//// MODALS

// Open add person modal
function addPersonModal(){
  clearInputs(['#form_add_person_name','#form_add_person_email',
              '#form_add_person_phone', '#form_add_person_organisation']);

  $('#form_add_person_organisation').prop('selectedIndex', 0);
  $('#form_add_person_organisation').formSelect();

  $('#addPersonModal').modal('open');
}

// Open add organisation modal
function addOrganisationModal(){
  clearInputs(['#form_add_organisation_name','#form_add_organisation_email',
              '#form_add_organisation_phone']);

  $('#addOrganisationModal').modal('open');
}

// Open edit person modal
function editPersonModal(e){
  var personElem = $(e.target).parents(".collection-item").first();
  var person = people.find(x => x.ID == personElem.data("id"));

  var ids = ['#form_edit_person_name','#form_edit_person_email',
              '#form_edit_person_phone', '#form_edit_person_organisation',
              '#form_edit_person_id'];
  var values = [person.name, person.email, person.phone, person.orgID, person.ID];
  fillInputs(ids,values);

  $('#form_edit_person_organisation').formSelect();

  $('#editPersonModal').modal('open');
}

// Open edit organisation modal
function editOrganisationModal(e){
  var organisationElem = $(e.target).parents(".collection-item").first();
  var organisation = organisations.find(x => x.ID == organisationElem.data("id"));

  var ids = ['#form_edit_organisation_name','#form_edit_organisation_email',
              '#form_edit_organisation_phone', '#form_edit_organisation_id'];
  var values = [organisation.name, organisation.email, organisation.phone, organisation.ID];
  fillInputs(ids,values);

  $('#editOrganisationModal').modal('open');
}

// Fill input fields with existing details (used for edit modals)
function fillInputs(idArray, valueArray){
  for(var i = 0; i < idArray.length; i++){
    $(idArray[i]).val(valueArray[i]).addClass('valid');
  }
  M.updateTextFields();
}

// Clears the inputs of given elements
function clearInputs(idArray){
  for(var i = 0; i < idArray.length; i++){
    $(idArray[i]).val('').removeClass('valid');
  }
}

// Populate the select field of the add/edit person modals
function populatePersonModalOptions(){
  $("#form_add_person_organisation").find('*').not('.unselectable').remove();
  $("#form_edit_person_organisation").find('*').not('.unselectable').remove();

  for(var i = 0; i < this.organisations.length; i++){
    var orgName = this.organisations[i].name;
    var orgID = this.organisations[i].ID;

    var newOption = `<option value="`+orgID+`">`+orgName+`</option>`;
    $("#form_add_person_organisation").append(newOption);
    $("#form_edit_person_organisation").append(newOption);
  }

  $('#form_add_person_organisation').prop('selectedIndex', 0);

  //Initialise materialize select
  $('#form_add_person_organisation').formSelect();
  $('#form_edit_person_organisation').formSelect();
}

//// EVENT HANDLERS

//Make organisation element active
function organisationClickHandler(e){
  $('#organisationHolder > .active').removeClass("active");

  var org = $(e.target);
  if(e.target.nodeName != 'LI'){
    org = $(e.target).parents(".collection-item").first();
  }

  org.addClass("active");
  var orgID = org.data("id");

  $("#personHolder").hide();
  populatePeople(orgID);
}

//Make person element active
function personClickHandler(e){
  $('#peopleHolder > .active').removeClass("active");

  var person = $(e.target);
  if(e.target.nodeName != 'LI'){
    person = $(e.target).parents(".collection-item").first();
  }
  person.addClass("active");
  var personID = person.data("id");

  populatePerson(personID);
}
