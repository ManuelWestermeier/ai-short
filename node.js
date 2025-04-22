const fs = require("fs");

fs.writeFileSync(
  "words.txt",
  [
    ...new Set(
      fs
        .readFileSync("words.txt")
        .toString("utf-8")
        .replace(/\r|\t/g, "")
        .split("\n")
    ),
  ].join("\n")
);
