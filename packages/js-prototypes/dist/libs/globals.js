if (typeof require == "function") {
    ["Number", "Object", "String", "Array"].forEach(function (m) {
        try {
            require("./" + m);
        }
        catch (e) { }
    });
}
