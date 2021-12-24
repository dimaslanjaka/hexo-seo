if (typeof require == "function") {
  ["Number", "Object", "String", "Array"].forEach((m) => {
    try {
      require("./" + m);
    } catch (e) {}
  });
}
