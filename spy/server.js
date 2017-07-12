const express = require("express")
const path = require("path")
const compression = require("compression")
const opn = require("opn");
const app = express();

app.use(compression());

app.use(express.static(path.join(__dirname, "./dist/")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  const serverUrl = "http://localhost:" + port;
  console.log("Production Express server running at " + serverUrl);
  opn(serverUrl)
  .then(() => {
    console.log("Browser successfully opened");
  }).catch(e => {
    console.error(e);
  });
});