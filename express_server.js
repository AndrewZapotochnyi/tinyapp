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

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// POST to see the full list of links
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body;
  urlDatabase[shortURL] = longURL["longURL"];
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

// POST to delete the link
app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// POST to register
app.post("/register", (req, res) => {
  
  // Adding user info to database
  let email = req.body["email"];
  let password = req.body["password"];
  let id = generateRandomString();
  
  
  if (email === "" || password === "") {
    res.status(400).end()
  }  else if (emailChecker(email, users) ){
    res.status(400).end()
  } else {
    users[id] = {email, password, id}
  }

  // Creating cookie with user id
  res.cookie('user_id', id);
  res.redirect("/urls");
});

// POST to login
app.post("/login", (req, res) => {
  //console.log(req.body);
  let username = req.body["username"];
  console.log('name', username);
  res.cookie('username', username);
  res.redirect("/urls");
});

// POST to logout
app.post("/logout", (req, res) => {
  //console.log(req.body);
  let username = req.cookies["username"];
  res.clearCookie('username', username);
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
  console.log(shortURL, longURL);
  urlDatabase[shortURL] = longURL;
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
  let templateVars = {'user_id': req.cookies["user_id"], shortURL: req.params.shortURL, longURL: urlDatabase, 'user' : user };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  let user = users[req.cookies["user_id"]];
  //let currentEmail = currentUser.email;
  
  let templateVars = {'user_id': req.cookies["user_id"], urls: urlDatabase, 'user' : user };
  
  res.render("urls_index", templateVars);
  
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:shortURL", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = {'user_id': req.cookies["user_id"], shortURL: req.params.shortURL, longURL: urlDatabase, 'user' : user  };
  let shortUrl = templateVars["shortURL"];
  
  let longUrl = urlDatabase[shortUrl];

  res.redirect(longUrl);
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

