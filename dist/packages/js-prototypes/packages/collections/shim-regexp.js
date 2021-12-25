"use strict";
/**
    accepts a string; returns the string with regex metacharacters escaped.
    the returned string can safely be used within a regex to match a literal
    string. escaped characters are [, ], {, }, (, ), -, *, +, ?, ., \, ^, $,
    |, #, [comma], and whitespace.
*/
if (!RegExp.escape) {
    var special = /[-[\]{}()*+?.\\^$|,#\s]/g;
    RegExp.escape = function (string) {
        return string.replace(special, "\\$&");
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpbS1yZWdleHAuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2pzLXByb3RvdHlwZXMvcGFja2FnZXMvY29sbGVjdGlvbnMvc2hpbS1yZWdleHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBOzs7OztFQUtFO0FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7SUFDaEIsSUFBSSxPQUFPLEdBQUcsMEJBQTBCLENBQUM7SUFDekMsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLE1BQU07UUFDNUIsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUM7Q0FDTCIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gICAgYWNjZXB0cyBhIHN0cmluZzsgcmV0dXJucyB0aGUgc3RyaW5nIHdpdGggcmVnZXggbWV0YWNoYXJhY3RlcnMgZXNjYXBlZC5cbiAgICB0aGUgcmV0dXJuZWQgc3RyaW5nIGNhbiBzYWZlbHkgYmUgdXNlZCB3aXRoaW4gYSByZWdleCB0byBtYXRjaCBhIGxpdGVyYWxcbiAgICBzdHJpbmcuIGVzY2FwZWQgY2hhcmFjdGVycyBhcmUgWywgXSwgeywgfSwgKCwgKSwgLSwgKiwgKywgPywgLiwgXFwsIF4sICQsXG4gICAgfCwgIywgW2NvbW1hXSwgYW5kIHdoaXRlc3BhY2UuXG4qL1xuaWYgKCFSZWdFeHAuZXNjYXBlKSB7XG4gICAgdmFyIHNwZWNpYWwgPSAvWy1bXFxde30oKSorPy5cXFxcXiR8LCNcXHNdL2c7XG4gICAgUmVnRXhwLmVzY2FwZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKHNwZWNpYWwsIFwiXFxcXCQmXCIpO1xuICAgIH07XG59XG5cbiJdfQ==