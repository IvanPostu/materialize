export default {
  srcDir: "bin",
  srcFiles: [
    "init.js",
    "materialize.js",
  ],
  specDir: "tests/temp",
  specFiles: [
    "**/*[sS]pec.js"
  ],
  helpers: [
    "helper.js", // located in specDir
  ],
  env: {
    stopSpecOnExpectationFailure: false,
    stopOnSpecFailure: false,
    random: true
  },
  listenAddress: "localhost",
  hostname: "localhost",
  browser: {
    name: "firefox"
  }
};
