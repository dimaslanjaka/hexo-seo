"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const broken_1 = require("../img/broken");
const log_1 = __importDefault(require("../log"));
const package_json_1 = __importDefault(require("../../package.json"));
const bluebird_1 = __importDefault(require("bluebird"));
function default_1(dom, HSconfig, data) {
    const images = dom.document.querySelectorAll("img");
    for (let index = 0; index < images.length; index++) {
        const img = images.item(index);
        const src = img.getAttribute("src");
        if (src) {
            if (/^https?:\/\//.test(src) && src.length > 0) {
                return (0, broken_1.checkBrokenImg)(src).then((check) => {
                    if (typeof check == "object" && !check.success) {
                        log_1.default.log("%s(IMG:broken) fixing %s", package_json_1.default.name, [src, check.resolved]);
                        img.setAttribute("src", check.resolved);
                        img.setAttribute("src-ori", check.original);
                    }
                });
            }
        }
    }
    return bluebird_1.default.resolve();
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJva2VuLnN0YXRpYy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsic3JjL2ltZy9icm9rZW4uc3RhdGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0EsMENBQStDO0FBQy9DLGlEQUE0QjtBQUM1QixzRUFBcUM7QUFDckMsd0RBQStCO0FBRS9CLG1CQUF5QixHQUFXLEVBQUUsUUFBb0IsRUFBRSxJQUFhO0lBQ3ZFLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEQsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDbEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXBDLElBQUksR0FBRyxFQUFFO1lBQ1AsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM5QyxPQUFPLElBQUEsdUJBQWMsRUFBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDeEMsSUFBSSxPQUFPLEtBQUssSUFBSSxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO3dCQUM5QyxhQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLHNCQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUN4RSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3hDLEdBQUcsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztxQkFDN0M7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLGtCQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDM0IsQ0FBQztBQW5CRCw0QkFtQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBfSlNET00gfSBmcm9tIFwiLi4vaHRtbC9kb21cIjtcbmltcG9ydCB7IEhleG9TZW8gfSBmcm9tIFwiLi4vaHRtbC9zY2hlbWEvYXJ0aWNsZVwiO1xuaW1wb3J0IHsgaW1nT3B0aW9ucyB9IGZyb20gXCIuL2luZGV4Lm9sZFwiO1xuaW1wb3J0IHsgY2hlY2tCcm9rZW5JbWcgfSBmcm9tIFwiLi4vaW1nL2Jyb2tlblwiO1xuaW1wb3J0IGxvZ2dlciBmcm9tIFwiLi4vbG9nXCI7XG5pbXBvcnQgcGtnIGZyb20gXCIuLi8uLi9wYWNrYWdlLmpzb25cIjtcbmltcG9ydCBQcm9taXNlIGZyb20gXCJibHVlYmlyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZG9tOiBfSlNET00sIEhTY29uZmlnOiBpbWdPcHRpb25zLCBkYXRhOiBIZXhvU2VvKSB7XG4gIGNvbnN0IGltYWdlcyA9IGRvbS5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpO1xuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgaW1hZ2VzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGNvbnN0IGltZyA9IGltYWdlcy5pdGVtKGluZGV4KTtcbiAgICBjb25zdCBzcmMgPSBpbWcuZ2V0QXR0cmlidXRlKFwic3JjXCIpO1xuXG4gICAgaWYgKHNyYykge1xuICAgICAgaWYgKC9eaHR0cHM/OlxcL1xcLy8udGVzdChzcmMpICYmIHNyYy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBjaGVja0Jyb2tlbkltZyhzcmMpLnRoZW4oKGNoZWNrKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjaGVjayA9PSBcIm9iamVjdFwiICYmICFjaGVjay5zdWNjZXNzKSB7XG4gICAgICAgICAgICBsb2dnZXIubG9nKFwiJXMoSU1HOmJyb2tlbikgZml4aW5nICVzXCIsIHBrZy5uYW1lLCBbc3JjLCBjaGVjay5yZXNvbHZlZF0pO1xuICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZShcInNyY1wiLCBjaGVjay5yZXNvbHZlZCk7XG4gICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKFwic3JjLW9yaVwiLCBjaGVjay5vcmlnaW5hbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufVxuIl19