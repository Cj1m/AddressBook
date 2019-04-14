//Contains various helper functions

module.exports = {
  peopleJson : 'json/people.json',
  organisationsJson : 'json/organisations.json',
  Person : require('../classes/Person'),
  Organisation : require('../classes/Organisation'),

  //Removes object with given id from given array
  removeObject: function (array, id){
    var indexToRemove = array.findIndex(x => x.ID == id);
    array.splice(indexToRemove, 1);
  },

  //Removes all people in a given organisation
  removePeopleInOrganisation: function(people, orgID){
    var newPeople = people.filter(x => x.orgID != orgID);
    return newPeople;
  },

  //Returns object with given id in given array
  getObject: function (array, id){
    var indexToGet = array.findIndex(x => x.ID == id);
    return array[indexToGet];
  },

  // Saves people to JSON file
  // Persistence through JSON means we don't have to concern ourselves
  // with database credentials
  savePeople: function(people, fs){
    var json = JSON.stringify(people);
    fs.writeFileSync(this.peopleJson, json);
  },

  // Saves organisations to JSON file
  saveOrganisations: function(organisations,fs){
    var json = JSON.stringify(organisations);
    fs.writeFileSync(this.organisationsJson, json);
  },

  // Load people from JSON file
  loadPeople: function(fs){
    var json = fs.readFileSync(this.peopleJson);
    var people = JSON.parse(json);
    var peopleArray = [];

    //Convert each object to a Person object
    for(var i = 0; i < people.length; i++){
      peopleArray.push(this.Person.fromComponents(people[i].ID,people[i].name, people[i].phone,
         people[i].email,people[i].orgID));
    }
    return peopleArray;
  },

  // Load organisations from JSON file
  loadOrganisations: function(fs){
    var json = fs.readFileSync(this.organisationsJson);
    var organisations = JSON.parse(json);
    var organisationArray = [];

    //Convert each object to an Organisation obj
    for(var i = 0; i < organisations.length; i++){
      organisationArray.push(this.Organisation.fromComponents(organisations[i].ID,
        organisations[i].name, organisations[i].phone,organisations[i].email));
    }
    return organisationArray;
  },
}
