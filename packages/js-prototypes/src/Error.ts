if (!("toJSON" in Error.prototype)) {
  // https://stackoverflow.com/a/18391400/6404439
  Object.defineProperty(Error.prototype, "toJSON", {
    value: function () {
      var alt = {};

      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true
  });
}
