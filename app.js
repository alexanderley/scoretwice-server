require("dotenv/config");
require("./db");
const express = require("express");
const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();

require("./config")(app);

// 👇 Start handling routes here
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const projectRouter = require("./routes/project.routes");
app.use("/api", isAuthenticated, projectRouter);

const taskRouter = require("./routes/task.routes");
app.use("/api", isAuthenticated, taskRouter);

//TRANSACTIONS
const transactionRouter = require("./routes/transactions.routes");
app.use("/api", isAuthenticated, transactionRouter);
//USER
const userRouter = require("./routes/user.routes");
app.use("/api", isAuthenticated, userRouter);


const creditScoreRouter = require("./routes/creditScore.routes");
app.use("/api", isAuthenticated, creditScoreRouter);

//AUTHENTIFICATION

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

require("./error-handling")(app);

module.exports = app;
