require("dotenv").config();
const connectToDatabase = require("./src/config/database")

const app = require("./src/app")

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
})

  