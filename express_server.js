const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

var cookieParser = require('cookie-parser')

app.use(cookieParser())

app.set("view engine", "ejs");

function generateRandomString() {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * 6));
  }
  return result;
}
//console.log(generateRandomString());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// POST to see the full list of links
app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  let shortURL = generateRandomString();
  //console.log(shortURL);
  let longURL = req.body;
  //console.log(longURL["longURL"]);
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
  let templateVars = {'username': req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {'username': req.cookies["username"]};
  res.render("reg", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {'username': req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {'username': req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
  // console.log(req.cookies["username"]);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:shortURL", (req, res) => {
  let templateVars = {'username': req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase };
  let shortUrl = templateVars["shortURL"];
  let longUrl = urlDatabase[shortUrl];

  res.redirect(longUrl);
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

