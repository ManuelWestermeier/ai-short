let file;

function getLikeliestCompletion(inp = "") {
  const input = inp.toLowerCase();
  const words = file.replace(/\n/g, " ").split(" ");
  const prefixMap = {};
  words.forEach((word) => {
    for (let i = 0; i < word.length; i++) {
      const prefix = word.slice(0, i + 1);
      if (!prefixMap[prefix]) prefixMap[prefix] = {};
      prefixMap[prefix][word] = (prefixMap[prefix][word] || 0) + 1;
    }
  });
  const prefixMatches = prefixMap[input] || {};
  return Object.entries(prefixMatches).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
    ["", 0]
  )[0];
}

async function compress(text = "") {
  if (!file) file = (await (await fetch("words.txt")).text()).toLowerCase();
  const words = text.split(" ");

  return words
    .map((word) => {
      for (let index = 1; index < word.length + 1; index++) {
        if (getLikeliestCompletion(word.slice(0, index)) == word) {
          return word;
        }
      }
      return " " + word;
    })
    .join(" ");
}

async function decompress(data) {
  if (!file) file = (await (await fetch("words.txt")).text()).toLowerCase();
  const out = [];

  const words = data.split(" ");

  for (let index = 0; index < words.length; index++) {
    if (words[index - 1] == "") out.push(words[index]);
    else if (words[index] == "") continue;
    else out.push(getLikeliestCompletion(words[index]));
  }

  return out.join(" ");
}
