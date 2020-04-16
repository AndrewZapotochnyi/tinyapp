const bcrypt = require('bcrypt');

const getUserByEmail = function(email, database) {
  // lookup magic...
  for (let key in database) {
    if (database[key].email === email) {
      let user = database[key];
      return user;
    };
  }
  return false;
};

// Filters out links database by UserID
const urlsForUser = function(id, linksObject) {
  let userUrlDatabase = {};
  for (let key in linksObject) {
    if (linksObject[key].userID === id) {
      userUrlDatabase[key] = linksObject[key];
    } 
  }
  return userUrlDatabase;
}

// Generates random ID
const generateRandomString = function() {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * 6));
  }
  return result;
}

// Checks whether the email is already in database
const emailChecker = function(currentEmail, usersObject) {
  for (let key in usersObject) {
    if (usersObject[key].email === currentEmail) {
      return true;
    };
  }
  return false;
}

// Password match checker
const passChecker = function(currentEmail, password, usersObject) {
  for (let key in usersObject) {
    if (usersObject[key].email === currentEmail && bcrypt.compareSync(password, usersObject[key].password)) {
      return true;
    };
  }
  return false;
}

// Get id by email
const getIdByEmail = function(currentEmail, usersObject) {
  for (let key in usersObject) {
    if (usersObject[key].email === currentEmail) {
      return key;
    };
  }
  return false;
}

let helperFunctions = {getUserByEmail, urlsForUser, generateRandomString, emailChecker, passChecker, getIdByEmail}

module.exports = helperFunctions;