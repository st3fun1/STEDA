const withCSS = require("@zeit/next-css");
const withSass = require("@zeit/next-sass");
const path = require("path");

function HACK_removeMinimizeOptionFromCssLoaders(config) {
  console.warn(
    "HACK: Removing `minimize` option from `css-loader` entries in Webpack config"
  );
  config.module.rules.forEach(rule => {
    if (Array.isArray(rule.use)) {
      rule.use.forEach(u => {
        if (u.loader === "css-loader" && u.options) {
          delete u.options.minimize;
        }
      });
    }
  });
}

module.exports = withSass(
  withCSS({
    webpack: (config, { dev }) => {
      HACK_removeMinimizeOptionFromCssLoaders(config);
      config.resolve.modules.push(path.resolve("./"));
      return config;
    }
  })
);
