module.exports = {
  transformIgnorePatterns: ["/node_modules/(?!three/examples/)"],
  preset: "ts-jest",
  transform: {
    "node_modules/three/examples/.+.(j|t)sx?$": "ts-jest",
  },
};
