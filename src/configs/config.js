require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || "development",
  domain: process.env.DOMAIN
};

module.exports = {
  config,
};
