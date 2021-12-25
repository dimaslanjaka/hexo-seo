"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_assign_1 = __importDefault(require("object-assign"));
const cache_1 = __importDefault(require("./cache"));
const cache = new cache_1.default();
const getConfig = function (hexo, key = "config-hexo-seo") {
    if (!cache.getCache(key)) {
        const defaultOpt = {
            js: {
                exclude: ["*.min.js"]
            },
            css: {
                exclude: ["*.min.css"]
            },
            html: {
                fix: false,
                exclude: [],
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                // Ignore '<!-- more -->' https://hexo.io/docs/tag-plugins#Post-Excerpt
                ignoreCustomComments: [/^\s*more/],
                removeComments: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                minifyJS: true,
                minifyCSS: true
            },
            //img: { default: source.img.fallback.public, onerror: "serverside" },
            img: {
                default: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
                onerror: "serverside"
            },
            host: ["webmanajemen.com"],
            links: {
                blank: true,
                enable: true,
                allow: ["webmanajemen.com"]
            },
            schema: true
        };
        /*if (!/^https?/gs.test(source.img.fallback.public)) {
        hexo.route.set(source.img.fallback.public, source.img.fallback.buffer);
      }*/
        const config = hexo.config;
        let seo = config.seo;
        if (typeof seo === "undefined")
            return defaultOpt;
        if (typeof seo.css === "boolean")
            delete seo.css;
        if (typeof seo.js === "boolean")
            delete seo.js;
        if (typeof seo.html === "boolean")
            delete seo.html;
        seo = (0, object_assign_1.default)(defaultOpt, seo);
        cache.setCache(key, seo);
        return seo;
    }
    return cache.getCache(key);
};
exports.default = getConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJzcmMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsa0VBQW1DO0FBTW5DLG9EQUErQjtBQWlEL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFRLEVBQUUsQ0FBQztBQUU3QixNQUFNLFNBQVMsR0FBRyxVQUFVLElBQVUsRUFBRSxHQUFHLEdBQUcsaUJBQWlCO0lBQzdELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3hCLE1BQU0sVUFBVSxHQUFzQjtZQUNwQyxFQUFFLEVBQUU7Z0JBQ0YsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO2FBQ3RCO1lBQ0QsR0FBRyxFQUFFO2dCQUNILE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQzthQUN2QjtZQUNELElBQUksRUFBRTtnQkFDSixHQUFHLEVBQUUsS0FBSztnQkFDVixPQUFPLEVBQUUsRUFBRTtnQkFDWCx5QkFBeUIsRUFBRSxJQUFJO2dCQUMvQixrQkFBa0IsRUFBRSxJQUFJO2dCQUN4Qix1RUFBdUU7Z0JBQ3ZFLG9CQUFvQixFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUNsQyxjQUFjLEVBQUUsSUFBSTtnQkFDcEIscUJBQXFCLEVBQUUsSUFBSTtnQkFDM0IsMEJBQTBCLEVBQUUsSUFBSTtnQkFDaEMsNkJBQTZCLEVBQUUsSUFBSTtnQkFDbkMsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsU0FBUyxFQUFFLElBQUk7YUFDaEI7WUFDRCxzRUFBc0U7WUFDdEUsR0FBRyxFQUFFO2dCQUNILE9BQU8sRUFDTCxvSEFBb0g7Z0JBQ3RILE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1lBQ0QsSUFBSSxFQUFFLENBQUMsa0JBQWtCLENBQUM7WUFDMUIsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxJQUFJO2dCQUNYLE1BQU0sRUFBRSxJQUFJO2dCQUNaLEtBQUssRUFBRSxDQUFDLGtCQUFrQixDQUFDO2FBQzVCO1lBQ0QsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDO1FBRUY7O1NBRUM7UUFFRCxNQUFNLE1BQU0sR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3ZDLElBQUksR0FBRyxHQUFzQixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3hDLElBQUksT0FBTyxHQUFHLEtBQUssV0FBVztZQUFFLE9BQVksVUFBVSxDQUFDO1FBQ3ZELElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxLQUFLLFNBQVM7WUFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDakQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssU0FBUztZQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUMvQyxJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxTQUFTO1lBQUUsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ25ELEdBQUcsR0FBRyxJQUFBLHVCQUFNLEVBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLE9BQU8sR0FBbUIsQ0FBQztLQUM1QjtJQUNELE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQWlCLENBQUM7QUFDN0MsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhleG8gZnJvbSBcImhleG9cIjtcbmltcG9ydCBIZXhvQ29uZmlnIGZyb20gXCJoZXhvL0hleG9Db25maWdcIjtcbmltcG9ydCBhc3NpZ24gZnJvbSBcIm9iamVjdC1hc3NpZ25cIjtcbmltcG9ydCB7IGpzTWluaWZ5T3B0aW9ucyB9IGZyb20gXCIuL21pbmlmaWVyL2pzXCI7XG5pbXBvcnQgeyBNaW5pZnlPcHRpb25zIGFzIGh0bWxNaW5pZnlPcHRpb25zIH0gZnJvbSBcIi4vbWluaWZpZXIvaHRtbFwiO1xuaW1wb3J0IHsgY3NzTWluaWZ5T3B0aW9ucyB9IGZyb20gXCIuL21pbmlmaWVyL2Nzc1wiO1xuaW1wb3J0IHsgaW1nT3B0aW9ucyB9IGZyb20gXCIuL2ltZy9pbmRleC5vbGRcIjtcbmltcG9ydCB7IGh5cGVybGlua09wdGlvbnMgfSBmcm9tIFwiLi9odG1sL3R5cGVzXCI7XG5pbXBvcnQgSW5NZW1vcnkgZnJvbSBcIi4vY2FjaGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBzZW9PcHRpb25zIGV4dGVuZHMgSGV4b0NvbmZpZyB7XG4gIHNlbz86IGRlZmF1bHRTZW9PcHRpb25zO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIGRlZmF1bHRTZW9PcHRpb25zIHtcbiAgLyoqXG4gICAqIE9wdGltaXplIGpzXG4gICAqL1xuICBqcz86IGJvb2xlYW4gfCBqc01pbmlmeU9wdGlvbnM7XG4gIC8qKlxuICAgKiBPcHRpbWl6ZSBjc3NcbiAgICovXG4gIGNzcz86IGJvb2xlYW4gfCBjc3NNaW5pZnlPcHRpb25zO1xuICAvKipcbiAgICogT3B0aW1pemUgaW1hZ2VcbiAgICovXG4gIGltZz86IGJvb2xlYW4gfCBpbWdPcHRpb25zO1xuICAvKipcbiAgICogTWluaW1pemUgaHRtbFxuICAgKi9cbiAgaHRtbD86IGJvb2xlYW4gfCBodG1sTWluaWZ5T3B0aW9ucztcbiAgLyoqXG4gICAqIEJsb2cgaG9zdG5hbWVcbiAgICovXG4gIGhvc3Q/OiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIE5vZm9sbG93IGxpbmtzXG4gICAqL1xuICBsaW5rcz86IGh5cGVybGlua09wdGlvbnM7XG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBzY2hlbWEgYXJ0aWNsZVxuICAgKi9cbiAgc2NoZW1hPzogYm9vbGVhbjtcbiAgc2l0ZW1hcD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmV0dXJuQ29uZmlnIHtcbiAgc2l0ZW1hcDogYm9vbGVhbjtcbiAganM6IGpzTWluaWZ5T3B0aW9ucztcbiAgY3NzOiBjc3NNaW5pZnlPcHRpb25zO1xuICBpbWc6IGltZ09wdGlvbnM7XG4gIGh0bWw6IGh0bWxNaW5pZnlPcHRpb25zO1xuICBsaW5rczogaHlwZXJsaW5rT3B0aW9ucztcbiAgaG9zdDogZGVmYXVsdFNlb09wdGlvbnNbXCJob3N0XCJdO1xuICBzY2hlbWE6IGJvb2xlYW47XG59XG5cbmNvbnN0IGNhY2hlID0gbmV3IEluTWVtb3J5KCk7XG5cbmNvbnN0IGdldENvbmZpZyA9IGZ1bmN0aW9uIChoZXhvOiBIZXhvLCBrZXkgPSBcImNvbmZpZy1oZXhvLXNlb1wiKTogUmV0dXJuQ29uZmlnIHtcbiAgaWYgKCFjYWNoZS5nZXRDYWNoZShrZXkpKSB7XG4gICAgY29uc3QgZGVmYXVsdE9wdDogZGVmYXVsdFNlb09wdGlvbnMgPSB7XG4gICAgICBqczoge1xuICAgICAgICBleGNsdWRlOiBbXCIqLm1pbi5qc1wiXVxuICAgICAgfSxcbiAgICAgIGNzczoge1xuICAgICAgICBleGNsdWRlOiBbXCIqLm1pbi5jc3NcIl1cbiAgICAgIH0sXG4gICAgICBodG1sOiB7XG4gICAgICAgIGZpeDogZmFsc2UsXG4gICAgICAgIGV4Y2x1ZGU6IFtdLFxuICAgICAgICBjb2xsYXBzZUJvb2xlYW5BdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICBjb2xsYXBzZVdoaXRlc3BhY2U6IHRydWUsXG4gICAgICAgIC8vIElnbm9yZSAnPCEtLSBtb3JlIC0tPicgaHR0cHM6Ly9oZXhvLmlvL2RvY3MvdGFnLXBsdWdpbnMjUG9zdC1FeGNlcnB0XG4gICAgICAgIGlnbm9yZUN1c3RvbUNvbW1lbnRzOiBbL15cXHMqbW9yZS9dLFxuICAgICAgICByZW1vdmVDb21tZW50czogdHJ1ZSxcbiAgICAgICAgcmVtb3ZlRW1wdHlBdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICByZW1vdmVTY3JpcHRUeXBlQXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgcmVtb3ZlU3R5bGVMaW5rVHlwZUF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgIG1pbmlmeUpTOiB0cnVlLFxuICAgICAgICBtaW5pZnlDU1M6IHRydWVcbiAgICAgIH0sXG4gICAgICAvL2ltZzogeyBkZWZhdWx0OiBzb3VyY2UuaW1nLmZhbGxiYWNrLnB1YmxpYywgb25lcnJvcjogXCJzZXJ2ZXJzaWRlXCIgfSxcbiAgICAgIGltZzoge1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIFwiaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy90aHVtYi9hL2FjL05vX2ltYWdlX2F2YWlsYWJsZS5zdmcvMTAyNHB4LU5vX2ltYWdlX2F2YWlsYWJsZS5zdmcucG5nXCIsXG4gICAgICAgIG9uZXJyb3I6IFwic2VydmVyc2lkZVwiXG4gICAgICB9LFxuICAgICAgaG9zdDogW1wid2VibWFuYWplbWVuLmNvbVwiXSxcbiAgICAgIGxpbmtzOiB7XG4gICAgICAgIGJsYW5rOiB0cnVlLFxuICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgIGFsbG93OiBbXCJ3ZWJtYW5hamVtZW4uY29tXCJdXG4gICAgICB9LFxuICAgICAgc2NoZW1hOiB0cnVlXG4gICAgfTtcblxuICAgIC8qaWYgKCEvXmh0dHBzPy9ncy50ZXN0KHNvdXJjZS5pbWcuZmFsbGJhY2sucHVibGljKSkge1xuICAgIGhleG8ucm91dGUuc2V0KHNvdXJjZS5pbWcuZmFsbGJhY2sucHVibGljLCBzb3VyY2UuaW1nLmZhbGxiYWNrLmJ1ZmZlcik7XG4gIH0qL1xuXG4gICAgY29uc3QgY29uZmlnOiBzZW9PcHRpb25zID0gaGV4by5jb25maWc7XG4gICAgbGV0IHNlbzogZGVmYXVsdFNlb09wdGlvbnMgPSBjb25maWcuc2VvO1xuICAgIGlmICh0eXBlb2Ygc2VvID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gPGFueT5kZWZhdWx0T3B0O1xuICAgIGlmICh0eXBlb2Ygc2VvLmNzcyA9PT0gXCJib29sZWFuXCIpIGRlbGV0ZSBzZW8uY3NzO1xuICAgIGlmICh0eXBlb2Ygc2VvLmpzID09PSBcImJvb2xlYW5cIikgZGVsZXRlIHNlby5qcztcbiAgICBpZiAodHlwZW9mIHNlby5odG1sID09PSBcImJvb2xlYW5cIikgZGVsZXRlIHNlby5odG1sO1xuICAgIHNlbyA9IGFzc2lnbihkZWZhdWx0T3B0LCBzZW8pO1xuICAgIGNhY2hlLnNldENhY2hlKGtleSwgc2VvKTtcbiAgICByZXR1cm4gc2VvIGFzIFJldHVybkNvbmZpZztcbiAgfVxuICByZXR1cm4gY2FjaGUuZ2V0Q2FjaGUoa2V5KSBhcyBSZXR1cm5Db25maWc7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRDb25maWc7XG4iXX0=