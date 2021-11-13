/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require("ts-node").register({ project: "tsconfig.json" });
const prompts = require("prompts");
const { exec } = require("child_process");
const { readdirSync, readFileSync, writeFileSync } = require("fs");
const path = require("path");
const testDir = path.join(__dirname, "src/__test__");
const scanDir = readdirSync(testDir);
const build = [];
scanDir
  .map((dir) => {
    return path.join(testDir, dir);
  })
  .forEach((file, index, array) => {
    const template = {
      value: file,
      title: path.basename(file.replace(/-_/, " "), ".ts")
    };
    const read = readFileSync(file).toString();
    const regex = /^\/\/.*title:\s?(.*)/gm;
    let match = regex.exec(read);
    if (match && typeof match[1] == "string" && match[1].length > 0) {
      template.title = match[1].trim();
    }
    build.push(template);
    writeFileSync(path.join(__dirname, "test.json"), JSON.stringify(build));
  });

(async () => {
  const tests = require("./test.json");
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
