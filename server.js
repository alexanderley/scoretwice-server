const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const VITE_PORT = process.env.VITE_PORT || 5005;

app.listen(VITE_PORT, () => {
  console.log(`Server listening on port http://localhost:${VITE_PORT}`);
});
