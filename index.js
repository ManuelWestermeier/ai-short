let file;
let prefixMap;

function buildPrefixMap() {
  prefixMap = {};
  const words = file.replace(/\n/g, " ").split(" ");
  words.forEach((word) => {
    word = word.toLowerCase();
    for (let i = 1; i <= word.length; i++) {
      const prefix = word.slice(0, i);
      if (!prefixMap[prefix]) prefixMap[prefix] = {};
      prefixMap[prefix][word] = (prefixMap[prefix][word] || 0) + 1;
    }
  });
}

function getLikeliestCompletion(prefix = "") {
  const matches = prefixMap[prefix.toLowerCase()] || {};
  return Object.entries(matches).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
    ["", 0]
  )[0];
}

function getShortestUniquePrefix(word) {
  word = word.toLowerCase();
  for (let i = 1; i <= word.length; i++) {
    const prefix = word.slice(0, i);
    if (getLikeliestCompletion(prefix) === word) {
      return prefix;
    }
  }
  return null;
}

async function compress(text = "") {
  if (!file) {
    file = (await (await fetch("words.txt")).text()).toLowerCase();
    buildPrefixMap();
  }

  return text
    .split(" ")
    .map((word) => {
      const prefix = getShortestUniquePrefix(word);
      if (prefix) return "~" + prefix; // predictable word
      return word; // raw word
    })
    .join(" ");
}

async function decompress(data) {
  if (!file) {
    file = (await (await fetch("words.txt")).text()).toLowerCase();
    buildPrefixMap();
  }

  return data
    .split(" ")
    .map((word) => {
      if (word.startsWith("~")) {
        return getLikeliestCompletion(word.slice(1));
      }
      return word;
    })
    .join(" ");
}
