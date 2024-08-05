// next.config.js
const dotenvExpand = require("dotenv-expand");
dotenvExpand.expand({parsed: {...process.env}});
module.exports = {
  images: {
    domains: ["picsum.photos"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
