"use strict";
module.exports = prng;
function prng(seed) {
    return function () {
        seed = ((seed * 60271) + 70451) % 99991;
        return seed / 99991;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJuZy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy90ZXN0L3NwZWMvcHJuZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDdEIsU0FBUyxJQUFJLENBQUMsSUFBSTtJQUNkLE9BQU87UUFDSCxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDeEMsT0FBTyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ3hCLENBQUMsQ0FBQTtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbm1vZHVsZS5leHBvcnRzID0gcHJuZztcbmZ1bmN0aW9uIHBybmcoc2VlZCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlZWQgPSAoKHNlZWQgKiA2MDI3MSkgKyA3MDQ1MSkgJSA5OTk5MTtcbiAgICAgICAgcmV0dXJuIHNlZWQgLyA5OTk5MTtcbiAgICB9XG59XG5cbiJdfQ==