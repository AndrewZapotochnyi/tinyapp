const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

var cookieParser = require('cookie-parser')

app.use(cookieParser())

app.set("view engine", "ejs");

const users = { 
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
}

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID"},
  "9sm5x4": { longURL: "http://azblockchain.co/", userID: "user2RandomID"},
  "9sm500": { longURL: "http://yandex.ru", userID: "user2RandomID"}
};

//console.log(urlDatabase["b2xVn2"].longURL);
//console.log(urlDatabase["b2xVn2"].userID);

// Filters out links database by UserID
function urlsForUser(id, linksObject) {
  let userUrlDatabase = {};
  for (let key in linksObject) {
    if (linksObject[key].userID === id) {
      userUrlDatabase[key] = linksObject[key];
    } 
  }
  return userUrlDatabase;
}

//console.log(urlsForUser("userRandomID", urlDatabase));

// Generates random ID
function generateRandomString() {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * 6));
  }
  return result;
}

// Checks whether the email is already in database
function emailChecker(currentEmail, usersObject) {
  for (let key in usersObject) {
    if (usersObject[key].email === currentEmail) {
      return true;
    };
  }
  return false;
}
// Password match checker
function passChecker(currentEmail, password, usersObject) {
  for (let key in usersObject) {
    if (usersObject[key].email === currentEmail && usersObject[key].password === password) {
      return true;
    };
  }
  return false;
}

// Get id by email
function getIdByEmail(currentEmail, usersObject) {
  for (let key in usersObject) {
    if (usersObject[key].email === currentEmail) {
      return key;
    };
  }
  return false;
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));



// POST to see the full list of links
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body;
  let user = users[req.cookies["user_id"]];

  //urlsForUser(id, linksObject)

  urlDatabase[shortURL] = { longURL: longURL["longURL"], userID: user.id };
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

// POST to delete the link
app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  
  if (req.cookies["user_id"] === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
  }

  res.redirect("/urls");
});

// POST to register
app.post("/register", (req, res) => {
  
  // Adding user info to database
  let email = req.body["email"];
  let password = req.body["password"];
  let id = generateRandomString();
  
  // Check, whether we already have such user and if email/password are not blank
  if (email === "" || password === "") {
    res.status(400).end()
  }  else if (emailChecker(email, users) ){
    res.status(400).end()
  } else {
    users[id] = {email, password, id};
    res.cookie('user_id', id);
  }

  // Creating cookie with user id
  
  res.redirect("/urls");
});

// POST to login
app.post("/login", (req, res) => {
  let email = req.body["email"];
  let password = req.body["password"];

  if (email === "" || password === "") {
    res.status(403).end()
  }  else if (emailChecker(email, users) ){
      if (passChecker(email, password, users)) {
        console.log("Pass and email match")
        let id = getIdByEmail(email, users);
        res.cookie('user_id', id); // Find user id using email
      } else {
        res.status(403).end()
      }
  } else {
    res.status(403).end()
  }

  res.redirect("/urls");
});

// POST to logout
app.post("/logout", (req, res) => {
  //console.log(req.body);
  let user = users[req.cookies["user_id"]];
  res.clearCookie('user_id', user);
  res.redirect("/urls");
});

// POST to login
app.get("/login", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = {'user_id': req.cookies["user_id"], 'user' : user};
  res.render("login", templateVars);

});

app.post("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL
  let user = users[req.cookies["user_id"]];

  if (req.cookies["user_id"] === urlDatabase[shortURL].userID) {
    //console.log(shortURL, longURL);
    urlDatabase[shortURL] = { longURL: longURL, userID: user.id };
  }

  res.redirect("/urls");
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  let user = users[req.cookies["user_id"]];

  if (!user) {
    res.redirect("/login");
  }

  let templateVars = {'user_id': req.cookies["user_id"], 'user' : user};
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = {'user_id': req.cookies["user_id"], 'user' : user};
  res.render("reg", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let user = users[req.cookies["user_id"]];

  let filteredDatabase = urlsForUser(user.id, urlDatabase);

  if (filteredDatabase[req.params.shortURL]) {
    let templateVars = {'user_id': req.cookies["user_id"], shortURL: req.params.shortURL, longURL: filteredDatabase, 'user' : user };
    res.render("urls_show", templateVars);
  } else {
    let templateVars = {'user_id': req.cookies["user_id"], 'user' : user}
    res.render("url_not_avail", templateVars);
  }

  
});

app.get("/urls", (req, res) => {
  let user = users[req.cookies["user_id"]];
  //let currentEmail = currentUser.email;

  if (!user) {
    res.redirect("/login");
  }
  
  let filteredDatabase = urlsForUser(user.id, urlDatabase);
  let templateVars = {'user_id': req.cookies["user_id"], urls: filteredDatabase, 'user' : user };
  
  res.render("urls_index", templateVars);
  
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:shortURL", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = {'user_id': req.cookies["user_id"], shortURL: req.params.shortURL, longURL: urlDatabase, 'user' : user  };
  let shortUrl = templateVars["shortURL"];
  
  let longUrl = urlDatabase[shortUrl].longURL;

  res.redirect(longUrl);
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

