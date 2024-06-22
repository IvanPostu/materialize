export default {
  srcDir: "src",
  srcFiles: [
    "**/*.js"
  ],
  specDir: "tests/temp",
  specFiles: [
    "**/*[sS]pec.js"
  ],
  helpers: [
    "tests/spec/helper.js",
    "helper.js",
    "helpers/**/*.js"
  ],
  env: {
    stopSpecOnExpectationFailure: false,
    stopOnSpecFailure: false,
    random: true
  },

  // For security, listen only to localhost. You can also specify a different
  // hostname or IP address, or remove the property or set it to "*" to listen
  // to all network interfaces.
  listenAddress: "localhost",

  // The hostname that the browser will use to connect to the server.
  hostname: "localhost",

  browser: {
    name: "firefox"
  }
};
