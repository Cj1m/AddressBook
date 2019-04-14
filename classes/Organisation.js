//Class for storing information about an organisation


// Constructor
function Organisation(name, phone, email) {
  //The ID of the organisation
  this.ID = new Date().getTime().toString();

  //Store details
  this.edit(name,phone,email);
}

// Used when loading from JSON
Organisation.fromComponents = function(ID, name, phone, email) {
  var loadedOrg = new this(name, phone, email);
  loadedOrg.ID = ID;

  return loadedOrg;
}

// class methods
Organisation.prototype.edit = function(name, phone, email) {
  this.name = name;
  this.phone = phone;
  this.email = email;
};


// export the class
module.exports = Organisation;
