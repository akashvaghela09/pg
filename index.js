require("dotenv").config();
const { config } = require("./src/configs/config");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.get("/test", (req, res) => {
  res.status(200).json(`Server OK... ${process.pid}`);
});

// Check if the module is being run directly
if (require.main === module) {
  app.listen(config.port, async () => {
    console.log(
      `:::: Server Started | PORT ${config.port} | ${config.environment} mode ::::`
    );

    const url = `http://localhost:${config.port}/test`;
    console.log(`\nCheck status at ${url} \n`);
  });
} else {
  // Export the app instance for importing
  module.exports = app;
}
