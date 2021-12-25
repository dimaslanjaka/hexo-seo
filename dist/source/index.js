"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Default image fallback if no image exists and not set on _config.yml
 */
let imgfallback = path_1.default.join(__dirname, "images", "no-image.png");
if (!fs.existsSync(imgfallback)) {
    imgfallback = path_1.default.join(__dirname, "../../../source/images", "no-image.png");
}
if (!fs.existsSync(imgfallback)) {
    imgfallback = path_1.default.join(__dirname, "../../source/images", "no-image.png");
}
if (!fs.existsSync(imgfallback)) {
    imgfallback = path_1.default.join(__dirname, "../source/images", "no-image.png");
}
const defaultObject = {
    img: {
        fallback: {
            buffer: fs.readFileSync(imgfallback),
            public: "/images/no-image.png"
        }
    }
};
exports.default = defaultObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNvdXJjZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBeUI7QUFDekIsZ0RBQXdCO0FBRXhCOztHQUVHO0FBQ0gsSUFBSSxXQUFXLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ2pFLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0lBQy9CLFdBQVcsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx3QkFBd0IsRUFBRSxjQUFjLENBQUMsQ0FBQztDQUM5RTtBQUNELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0lBQy9CLFdBQVcsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxxQkFBcUIsRUFBRSxjQUFjLENBQUMsQ0FBQztDQUMzRTtBQUNELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0lBQy9CLFdBQVcsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLENBQUMsQ0FBQztDQUN4RTtBQUVELE1BQU0sYUFBYSxHQUFHO0lBQ3BCLEdBQUcsRUFBRTtRQUNILFFBQVEsRUFBRTtZQUNSLE1BQU0sRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztZQUNwQyxNQUFNLEVBQUUsc0JBQXNCO1NBQy9CO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsa0JBQWUsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG4vKipcbiAqIERlZmF1bHQgaW1hZ2UgZmFsbGJhY2sgaWYgbm8gaW1hZ2UgZXhpc3RzIGFuZCBub3Qgc2V0IG9uIF9jb25maWcueW1sXG4gKi9cbmxldCBpbWdmYWxsYmFjayA9IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiaW1hZ2VzXCIsIFwibm8taW1hZ2UucG5nXCIpO1xuaWYgKCFmcy5leGlzdHNTeW5jKGltZ2ZhbGxiYWNrKSkge1xuICBpbWdmYWxsYmFjayA9IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vc291cmNlL2ltYWdlc1wiLCBcIm5vLWltYWdlLnBuZ1wiKTtcbn1cbmlmICghZnMuZXhpc3RzU3luYyhpbWdmYWxsYmFjaykpIHtcbiAgaW1nZmFsbGJhY2sgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uLy4uL3NvdXJjZS9pbWFnZXNcIiwgXCJuby1pbWFnZS5wbmdcIik7XG59XG5pZiAoIWZzLmV4aXN0c1N5bmMoaW1nZmFsbGJhY2spKSB7XG4gIGltZ2ZhbGxiYWNrID0gcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9zb3VyY2UvaW1hZ2VzXCIsIFwibm8taW1hZ2UucG5nXCIpO1xufVxuXG5jb25zdCBkZWZhdWx0T2JqZWN0ID0ge1xuICBpbWc6IHtcbiAgICBmYWxsYmFjazoge1xuICAgICAgYnVmZmVyOiBmcy5yZWFkRmlsZVN5bmMoaW1nZmFsbGJhY2spLFxuICAgICAgcHVibGljOiBcIi9pbWFnZXMvbm8taW1hZ2UucG5nXCJcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRPYmplY3Q7XG4iXX0=