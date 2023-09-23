import "dotenv/config";
import exphbs from "express-handlebars";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import userRouter from "./routes/users.routes.js";
import productRouter from "./routes/products.routes.js";
import sessionRouter from "./routes/session.routes.js";

const app = express();
const PORT = 4000;

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "register",
  })
);
app.set("view engine", ".hbs");

//BDD
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("BDD conectada");
  })
  .catch(() => console.log("Error en conexion a BDD"));

//Middlewares
app.use(express.json());
app.use(cookieParser(process.env.SIGNED_COOKIE));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 60,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/sessions", sessionRouter);

//Server
app.listen(PORT, () => {
  console.log(`Server on Port ${PORT}`);
});
