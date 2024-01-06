const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");


app.use(cors());

app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);



// const generateJwt = (user) => {
//   const payload = { username: user.username };
//   return jwt.sign(payload, secretKey, { expiresIn: "1h" });
// };

mongoose.connect(
  "mongodb+srv://jayedaktar35:id0aYxJgiRu1byug@cluster0.limxhxy.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: "Courses" }
);


app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
