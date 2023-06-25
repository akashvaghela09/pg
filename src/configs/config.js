require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || "development",
  domain: process.env.DOMAIN,
  axiosConfig: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537',
    }
  }
};

module.exports = {
  config,
};
