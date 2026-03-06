import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;

app.listen(PORT, () => {
  console.log(`Server running on port http://${DB_HOST}:${PORT}`);
});