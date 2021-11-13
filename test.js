/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require("ts-node").register({ project: "tsconfig.json" });
const tests = require("./test.json");
const prompts = require("prompts");
const { exec } = require("child_process");

(async () => {
  const response = await prompts([
    {
      type: "multiselect",
      name: "script",
      message: "Pick scripts to test",
      choices: tests
    }
  ]);

  /**
   * @type {string[]}
   */
  const scripts = response.script;
  scripts.map((script) => {
    exec(`node -r ts-node/register ${script}`, (err, stdout, stderr) => {
      if (err) {
        throw err;
      }
      if (stdout.length > 0) {
        console.log(stdout);
      }
      if (stderr.length > 0) {
        console.log(stderr);
      }
    });
  });
})();
