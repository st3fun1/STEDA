const path = require("path");
const withImages = require("next-images");
const withCSS = require("@zeit/next-css");
const withSass = require("@zeit/next-sass");

module.exports = withCSS(
  withSass(
    withImages({
      webpack: (
        config,
        { buildId, dev, isServer, defaultLoaders, webpack }
      ) => {
        // Note: we provide webpack above so you should not `require` it
        // Perform customizations to webpack config
        // Important: return the modified config

        // Here is the magic
        // We push our config into the resolve.modules array
        config.resolve.modules.push(path.resolve("./"));

        return config;
      },
      webpackDevMiddleware: config => {
        // Perform customizations to webpack dev middleware config
        // Important: return the modified config
        return config;
      },
      env: {
        key: "test"
      },
      compress: false
    })
  )
);
