const mongoose = require("mongoose");

const VITE_MONGO_URI =
  process.env.VITE_MONGO_URI ||
  "mongodb://127.0.0.1:27017/project-management-server";

mongoose
  .connect(VITE_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
