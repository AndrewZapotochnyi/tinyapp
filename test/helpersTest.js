const { assert } = require('chai');

const helperFunctions = require("../helpers");
const getUserByEmail = helperFunctions.getUserByEmail;
const urlsForUser = helperFunctions.urlsForUser;
const emailChecker = helperFunctions.emailChecker;
const passChecker = helperFunctions.passChecker;


const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID"},
  "9sm5x4": { longURL: "http://azblockchain.co/", userID: "user2RandomID"},
  "9sm500": { longURL: "http://yandex.ru", userID: "user2RandomID"}
};

// Testing User By Email Search
describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
  });

  it('should return false if a user is not found', function() {
    const user = getUserByEmail("user123@example.com", testUsers)
    const expectedOutput = false;
  });
});

// Testing Urls For User Filter
describe('urlsForUser', function() {
  it('should return an object with filtered by user links', function() {
    const urls = urlsForUser("userRandomID", urlDatabase);
    const expectedOutput = {"b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"}};
  });

  it('should return an empty object if no links for that user', function() {
    const urls = urlsForUser("userRandomID11", urlDatabase);
    const expectedOutput = {};
  });
});

// Testing Email Checker - Checks whether the email is already in database
describe('emailChecker', function() {
  it('should return true if email is already in database', function() {
    const user = emailChecker("user@example.com", testUsers)
    const expectedOutput = true;
  });

  it('should return false if email is not in database', function() {
    const user = emailChecker("user123@example.com", testUsers)
    const expectedOutput = false;
  });
});

// Testing passChecker - Password & Email match checker
describe('passChecker', function() {
  it('should return true if email & password are matching', function() {
    const passMatch = passChecker("user2@example.com", "dishwasher-funk", testUsers);
    const expectedOutput = true;
  });

  it('should return false if email & password are not matching', function() {
    const user = passChecker("user2@example.com", "dishwasher-fun", testUsers);
    const expectedOutput = false;
  });
});