//Class for storing information about a person

// Constructor
function Person(name, phone, email, orgID) {
  //The ID of the person
  this.ID = new Date().getTime().toString();

  //Store details
  this.edit(name,phone,email,orgID);
}

// Used when loading from JSON
Person.fromComponents = function(ID, name, phone, email, orgID) {
  var loadedPerson = new this(name, phone, email, orgID);
  loadedPerson.ID = ID;

  return loadedPerson;
}

// class methods
Person.prototype.edit = function(name, phone, email, orgID) {
  this.name = name;
  this.phone = phone;
  this.email = email;

  //The ID of the organisation this person belongs to
  this.orgID = orgID;
};

// export the class
module.exports = Person;
