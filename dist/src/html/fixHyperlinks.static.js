"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyRels = void 0;
const types_1 = require("./types");
const url_parse_1 = __importDefault(require("url-parse"));
function default_1(dom, HSconfig, data) {
    const a = dom.document.querySelectorAll("a[href]");
    if (a.length) {
        a.forEach((el) => {
            const href = el.href;
            // only process anchor start with https?, otherwise abadoned
            if (/https?/gs.test(href)) {
                const parseHref = (0, url_parse_1.default)(href);
                let rels = el.getAttribute("rel") ? el.getAttribute("rel").split(" ") : [];
                const external = (0, types_1.isExternal)(parseHref, hexo);
                rels = identifyRels(el, external, HSconfig);
                el.setAttribute("rel", rels.join(" "));
            }
            // set anchor title
            const aTitle = el.getAttribute("title");
            if (!aTitle || aTitle.length < 1) {
                let textContent;
                if (!el.textContent || el.textContent.length < 1) {
                    textContent = hexo.config.title;
                }
                else {
                    textContent = el.textContent;
                }
                el.setAttribute("title", (0, types_1.formatAnchorText)(textContent));
            }
        });
    }
}
exports.default = default_1;
function identifyRels(el, external, HSconfig) {
    let rels = [];
    const externalArr = ["nofollow", "noopener", "noreferer", "noreferrer"];
    const internalArr = ["internal", "follow", "bookmark"];
    // if external link, assign external rel attributes and remove items from internal attributes if exists, and will do the opposite if the internal link
    if (external) {
        rels = rels.concat(externalArr).unique().hapusItemDariArrayLain(internalArr);
        if (typeof HSconfig.blank == "boolean" && HSconfig.blank) {
            el.setAttribute("target", "_blank");
        }
    }
    else {
        rels = rels.concat(internalArr).unique().hapusItemDariArrayLain(externalArr);
    }
    return rels;
}
exports.identifyRels = identifyRels;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4SHlwZXJsaW5rcy5zdGF0aWMuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9odG1sL2ZpeEh5cGVybGlua3Muc3RhdGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLG1DQUF5RTtBQUV6RSwwREFBaUM7QUFFakMsbUJBQXlCLEdBQVcsRUFBRSxRQUEwQixFQUFFLElBQWE7SUFDN0UsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuRCxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7UUFDWixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBcUIsRUFBRSxFQUFFO1lBQ2xDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDckIsNERBQTREO1lBQzVELElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDekIsTUFBTSxTQUFTLEdBQUcsSUFBQSxtQkFBUSxFQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUUzRSxNQUFNLFFBQVEsR0FBRyxJQUFBLGtCQUFVLEVBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM3QyxJQUFJLEdBQUcsWUFBWSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzVDLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN4QztZQUNELG1CQUFtQjtZQUNuQixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ2hDLElBQUksV0FBbUIsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNoRCxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7aUJBQ2pDO3FCQUFNO29CQUNMLFdBQVcsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDO2lCQUM5QjtnQkFDRCxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFBLHdCQUFnQixFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7YUFDekQ7UUFDSCxDQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQTNCRCw0QkEyQkM7QUFFRCxTQUFnQixZQUFZLENBQzFCLEVBQThELEVBQzlELFFBQWlCLEVBQ2pCLFFBQTBCO0lBRTFCLElBQUksSUFBSSxHQUFhLEVBQUUsQ0FBQztJQUN4QixNQUFNLFdBQVcsR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3hFLE1BQU0sV0FBVyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN2RCxzSkFBc0o7SUFDdEosSUFBSSxRQUFRLEVBQUU7UUFDWixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3RSxJQUFJLE9BQU8sUUFBUSxDQUFDLEtBQUssSUFBSSxTQUFTLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtZQUN4RCxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNyQztLQUNGO1NBQU07UUFDTCxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUM5RTtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQWxCRCxvQ0FrQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBfSlNET00gfSBmcm9tIFwiLi9kb21cIjtcbmltcG9ydCB7IGZvcm1hdEFuY2hvclRleHQsIGh5cGVybGlua09wdGlvbnMsIGlzRXh0ZXJuYWwgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgSGV4b1NlbyB9IGZyb20gXCIuL3NjaGVtYS9hcnRpY2xlXCI7XG5pbXBvcnQgcGFyc2VVcmwgZnJvbSBcInVybC1wYXJzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZG9tOiBfSlNET00sIEhTY29uZmlnOiBoeXBlcmxpbmtPcHRpb25zLCBkYXRhOiBIZXhvU2VvKSB7XG4gIGNvbnN0IGEgPSBkb20uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImFbaHJlZl1cIik7XG4gIGlmIChhLmxlbmd0aCkge1xuICAgIGEuZm9yRWFjaCgoZWw6IEhUTUxBbmNob3JFbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBocmVmID0gZWwuaHJlZjtcbiAgICAgIC8vIG9ubHkgcHJvY2VzcyBhbmNob3Igc3RhcnQgd2l0aCBodHRwcz8sIG90aGVyd2lzZSBhYmFkb25lZFxuICAgICAgaWYgKC9odHRwcz8vZ3MudGVzdChocmVmKSkge1xuICAgICAgICBjb25zdCBwYXJzZUhyZWYgPSBwYXJzZVVybChocmVmKTtcbiAgICAgICAgbGV0IHJlbHMgPSBlbC5nZXRBdHRyaWJ1dGUoXCJyZWxcIikgPyBlbC5nZXRBdHRyaWJ1dGUoXCJyZWxcIikuc3BsaXQoXCIgXCIpIDogW107XG5cbiAgICAgICAgY29uc3QgZXh0ZXJuYWwgPSBpc0V4dGVybmFsKHBhcnNlSHJlZiwgaGV4byk7XG4gICAgICAgIHJlbHMgPSBpZGVudGlmeVJlbHMoZWwsIGV4dGVybmFsLCBIU2NvbmZpZyk7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcInJlbFwiLCByZWxzLmpvaW4oXCIgXCIpKTtcbiAgICAgIH1cbiAgICAgIC8vIHNldCBhbmNob3IgdGl0bGVcbiAgICAgIGNvbnN0IGFUaXRsZSA9IGVsLmdldEF0dHJpYnV0ZShcInRpdGxlXCIpO1xuICAgICAgaWYgKCFhVGl0bGUgfHwgYVRpdGxlLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgbGV0IHRleHRDb250ZW50OiBzdHJpbmc7XG4gICAgICAgIGlmICghZWwudGV4dENvbnRlbnQgfHwgZWwudGV4dENvbnRlbnQubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIHRleHRDb250ZW50ID0gaGV4by5jb25maWcudGl0bGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dENvbnRlbnQgPSBlbC50ZXh0Q29udGVudDtcbiAgICAgICAgfVxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBmb3JtYXRBbmNob3JUZXh0KHRleHRDb250ZW50KSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlkZW50aWZ5UmVscyhcbiAgZWw6IEhUTUxBbmNob3JFbGVtZW50IHwgaW1wb3J0KFwibm9kZS1odG1sLXBhcnNlclwiKS5IVE1MRWxlbWVudCxcbiAgZXh0ZXJuYWw6IGJvb2xlYW4sXG4gIEhTY29uZmlnOiBoeXBlcmxpbmtPcHRpb25zXG4pIHtcbiAgbGV0IHJlbHM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGV4dGVybmFsQXJyID0gW1wibm9mb2xsb3dcIiwgXCJub29wZW5lclwiLCBcIm5vcmVmZXJlclwiLCBcIm5vcmVmZXJyZXJcIl07XG4gIGNvbnN0IGludGVybmFsQXJyID0gW1wiaW50ZXJuYWxcIiwgXCJmb2xsb3dcIiwgXCJib29rbWFya1wiXTtcbiAgLy8gaWYgZXh0ZXJuYWwgbGluaywgYXNzaWduIGV4dGVybmFsIHJlbCBhdHRyaWJ1dGVzIGFuZCByZW1vdmUgaXRlbXMgZnJvbSBpbnRlcm5hbCBhdHRyaWJ1dGVzIGlmIGV4aXN0cywgYW5kIHdpbGwgZG8gdGhlIG9wcG9zaXRlIGlmIHRoZSBpbnRlcm5hbCBsaW5rXG4gIGlmIChleHRlcm5hbCkge1xuICAgIHJlbHMgPSByZWxzLmNvbmNhdChleHRlcm5hbEFycikudW5pcXVlKCkuaGFwdXNJdGVtRGFyaUFycmF5TGFpbihpbnRlcm5hbEFycik7XG4gICAgaWYgKHR5cGVvZiBIU2NvbmZpZy5ibGFuayA9PSBcImJvb2xlYW5cIiAmJiBIU2NvbmZpZy5ibGFuaykge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZWxzID0gcmVscy5jb25jYXQoaW50ZXJuYWxBcnIpLnVuaXF1ZSgpLmhhcHVzSXRlbURhcmlBcnJheUxhaW4oZXh0ZXJuYWxBcnIpO1xuICB9XG4gIHJldHVybiByZWxzO1xufVxuIl19