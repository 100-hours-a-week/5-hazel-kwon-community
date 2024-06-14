import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express();
const PORT = 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, './')));
app.use(cors());

app.get("/login", (req, res) => {
  console.log(req.headers);
  let { email, userPassword } = req.query;
  console.log(email, userPassword);
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/create", (req, res) => {
  console.log(req.headers);
  let { chooseFile, email, userPassword, nickName } = req.query;
  console.log(chooseFile, email, userPassword, nickName);
  res.sendFile(path.join(__dirname, "create.html"));
});

app.get("/main", (req, res) => {
  res.sendFile(path.join(__dirname, "main.html"));
});

app.get("/detail", (req, res) => {
  console.log(req.headers);
  let { comment } = req.query;
  console.log(comment);
  res.sendFile(path.join(__dirname, "detail.html"));
});

app.get("/posting", (req, res) => {
  console.log(req.headers);
  let { title, content, chooseFile } = req.query;
  console.log(title, content, chooseFile);
  res.sendFile(path.join(__dirname, "posting.html"));
});

app.get("/postupdate", (req, res) => {
  console.log(req.headers);
  let { content, chooseFile } = req.query;
  console.log(content, chooseFile);
  res.sendFile(path.join(__dirname, "postupdate.html"));
});

app.get("/update", (req, res) => {
  console.log(req.headers);
  let { chooseFile, nickName } = req.query;
  console.log(chooseFile, nickName);
  res.sendFile(path.join(__dirname, "update.html"));
});

app.get("/pwchange", (req, res) => {
  console.log(req.headers);
  let { userPassword } = req.query;
  console.log(userPassword);
  res.sendFile(path.join(__dirname, "pwchange.html"));
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});