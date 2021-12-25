"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExternal = exports.formatAnchorText = void 0;
const url_parse_1 = __importDefault(require("url-parse"));
const config_1 = __importDefault(require("../config"));
function formatAnchorText(text) {
    return text.replace(/['"]/gm, "");
}
exports.formatAnchorText = formatAnchorText;
/**
 * is url external link
 * @param url
 * @param hexo
 * @returns
 */
function isExternal(url, hexo) {
    const site = typeof (0, url_parse_1.default)(hexo.config.url).hostname == "string" ? (0, url_parse_1.default)(hexo.config.url).hostname : null;
    const cases = typeof url.hostname == "string" ? url.hostname.trim() : null;
    const config = (0, config_1.default)(hexo);
    const allowed = Array.isArray(config.links.allow) ? config.links.allow : [];
    const hosts = config.host;
    // if url hostname empty, its internal
    if (!cases)
        return false;
    // if url hostname same with site hostname, its internal
    if (cases == site)
        return false;
    // if arrays contains url hostname, its internal and allowed to follow
    if (hosts.includes(cases) || allowed.includes(cases))
        return false;
    /*if (cases.includes("manajemen")) {
      logger.log({ site: site, cases: cases, allowed: allowed, hosts: hosts });
    }*/
    return true;
}
exports.isExternal = isExternal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9odG1sL3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDBEQUFpQztBQUNqQyx1REFBa0M7QUFhbEMsU0FBZ0IsZ0JBQWdCLENBQUMsSUFBWTtJQUMzQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFGRCw0Q0FFQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFDLEdBQWdDLEVBQUUsSUFBVTtJQUNyRSxNQUFNLElBQUksR0FBRyxPQUFPLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQy9HLE1BQU0sS0FBSyxHQUFHLE9BQU8sR0FBRyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMzRSxNQUFNLE1BQU0sR0FBRyxJQUFBLGdCQUFTLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzVFLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFFMUIsc0NBQXNDO0lBQ3RDLElBQUksQ0FBQyxLQUFLO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDekIsd0RBQXdEO0lBQ3hELElBQUksS0FBSyxJQUFJLElBQUk7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUNoQyxzRUFBc0U7SUFDdEUsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFFbkU7O09BRUc7SUFFSCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFuQkQsZ0NBbUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhcnNlVXJsIGZyb20gXCJ1cmwtcGFyc2VcIjtcbmltcG9ydCBnZXRDb25maWcgZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IEhleG8gZnJvbSBcImhleG9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBoeXBlcmxpbmtPcHRpb25zIHtcbiAgZW5hYmxlOiBib29sZWFuO1xuICBibGFuazogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEFsbG93IGV4dGVybmFsIGxpbmsgdG8gYmUgZG9mb2xsb3dlZFxuICAgKiBpbnNlcnQgaG9zdG5hbWUgb3IgZnVsbCB1cmxcbiAgICovXG4gIGFsbG93Pzogc3RyaW5nW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRBbmNob3JUZXh0KHRleHQ6IHN0cmluZykge1xuICByZXR1cm4gdGV4dC5yZXBsYWNlKC9bJ1wiXS9nbSwgXCJcIik7XG59XG5cbi8qKlxuICogaXMgdXJsIGV4dGVybmFsIGxpbmtcbiAqIEBwYXJhbSB1cmxcbiAqIEBwYXJhbSBoZXhvXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNFeHRlcm5hbCh1cmw6IFJldHVyblR5cGU8dHlwZW9mIHBhcnNlVXJsPiwgaGV4bzogSGV4byk6IGJvb2xlYW4ge1xuICBjb25zdCBzaXRlID0gdHlwZW9mIHBhcnNlVXJsKGhleG8uY29uZmlnLnVybCkuaG9zdG5hbWUgPT0gXCJzdHJpbmdcIiA/IHBhcnNlVXJsKGhleG8uY29uZmlnLnVybCkuaG9zdG5hbWUgOiBudWxsO1xuICBjb25zdCBjYXNlcyA9IHR5cGVvZiB1cmwuaG9zdG5hbWUgPT0gXCJzdHJpbmdcIiA/IHVybC5ob3N0bmFtZS50cmltKCkgOiBudWxsO1xuICBjb25zdCBjb25maWcgPSBnZXRDb25maWcoaGV4byk7XG4gIGNvbnN0IGFsbG93ZWQgPSBBcnJheS5pc0FycmF5KGNvbmZpZy5saW5rcy5hbGxvdykgPyBjb25maWcubGlua3MuYWxsb3cgOiBbXTtcbiAgY29uc3QgaG9zdHMgPSBjb25maWcuaG9zdDtcblxuICAvLyBpZiB1cmwgaG9zdG5hbWUgZW1wdHksIGl0cyBpbnRlcm5hbFxuICBpZiAoIWNhc2VzKSByZXR1cm4gZmFsc2U7XG4gIC8vIGlmIHVybCBob3N0bmFtZSBzYW1lIHdpdGggc2l0ZSBob3N0bmFtZSwgaXRzIGludGVybmFsXG4gIGlmIChjYXNlcyA9PSBzaXRlKSByZXR1cm4gZmFsc2U7XG4gIC8vIGlmIGFycmF5cyBjb250YWlucyB1cmwgaG9zdG5hbWUsIGl0cyBpbnRlcm5hbCBhbmQgYWxsb3dlZCB0byBmb2xsb3dcbiAgaWYgKGhvc3RzLmluY2x1ZGVzKGNhc2VzKSB8fCBhbGxvd2VkLmluY2x1ZGVzKGNhc2VzKSkgcmV0dXJuIGZhbHNlO1xuXG4gIC8qaWYgKGNhc2VzLmluY2x1ZGVzKFwibWFuYWplbWVuXCIpKSB7XG4gICAgbG9nZ2VyLmxvZyh7IHNpdGU6IHNpdGUsIGNhc2VzOiBjYXNlcywgYWxsb3dlZDogYWxsb3dlZCwgaG9zdHM6IGhvc3RzIH0pO1xuICB9Ki9cblxuICByZXR1cm4gdHJ1ZTtcbn1cbiJdfQ==