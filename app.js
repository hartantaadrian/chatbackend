const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const HttpError = require("./models/http-error");

const socket = require("./socket");
const loginRoutes = require("./routes/login");

const port = 3434;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });
socket(wss);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/users/", loginRoutes);
app.use((req, res, next) => {
  throw new HttpError("path not found", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  console.log(error);
  res.status(error.code || 500);
  res.json({ message: error.message || "An error occured on server!!" });
});

mongoose
  .connect(
    `mongodb+srv://adrian:X-Hael120296@cluster0.sxq07.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() =>
    app.listen(5000, () => {
      console.log("API run on port 5000");
    })
  )
  .catch((err) => console.log(err));

server.listen(port, () => {
  console.log(`Server run on port ${port}`);
});
