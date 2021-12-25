"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_index_json_1 = __importDefault(require("./data-index.json"));
class schemaHomepage {
    constructor(options) {
        this.schema = data_index_json_1.default;
        this.options = options;
        this.hexo = options.hexo;
        // remove default articles
        this.schema.mainEntity.itemListElement = [];
    }
    addArticle(article) {
        // get sample data
        const item = data_index_json_1.default.mainEntity.itemListElement[0];
        // set metadata
        item.headline = article.title;
        if (typeof article.image == "string")
            item.image = article.image;
        item.position = this.schema.mainEntity.itemListElement.length.toString();
        // set author data
        if (typeof article.author == "object") {
            if (typeof article.author.image == "string") {
                item.author.image = article.author.image;
            }
            if (typeof article.author.name == "string") {
                item.author.name = article.author.name;
            }
            if (typeof article.author.url == "string" || Array.isArray(article.author.url)) {
                item.author.sameAs = article.author.url;
            }
        }
    }
    /**
     * Set custom property and value
     * @param key
     * @param value
     */
    set(key, value) {
        this.schema[key] = value;
    }
    /**
     * get schema property
     */
    get(key) {
        return this.schema[key];
    }
    toString() {
        if (this.options.pretty) {
            return JSON.stringify(this.schema, null, 2);
        }
        return JSON.stringify(this.schema);
    }
}
exports.default = schemaHomepage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9odG1sL3NjaGVtYS9ob21lcGFnZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdFQUFxQztBQVNyQyxNQUFNLGNBQWM7SUFJbEIsWUFBWSxPQUE4QjtRQUgxQyxXQUFNLEdBQUcseUJBQUksQ0FBQztRQUlaLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN6QiwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQW9HO1FBQzdHLGtCQUFrQjtRQUNsQixNQUFNLElBQUksR0FBRyx5QkFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEQsZUFBZTtRQUNmLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM5QixJQUFJLE9BQU8sT0FBTyxDQUFDLEtBQUssSUFBSSxRQUFRO1lBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUV6RSxrQkFBa0I7UUFDbEIsSUFBSSxPQUFPLE9BQU8sQ0FBQyxNQUFNLElBQUksUUFBUSxFQUFFO1lBQ3JDLElBQUksT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxRQUFRLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQzFDO1lBQ0QsSUFBSSxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTtnQkFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFDeEM7WUFDRCxJQUFJLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDOUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDekM7U0FDRjtJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFVO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7T0FFRztJQUNILEdBQUcsQ0FBQyxHQUFHO1FBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDN0M7UUFDRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7Q0FDRjtBQUVELGtCQUFlLGNBQWMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkYXRhIGZyb20gXCIuL2RhdGEtaW5kZXguanNvblwiO1xuaW1wb3J0IHsgU2NoZW1hQXJ0aWNsZU9wdGlvbnMgfSBmcm9tIFwiLi4vYXJ0aWNsZVwiO1xuaW1wb3J0IEhleG8sIHsgVGVtcGxhdGVMb2NhbHMgfSBmcm9tIFwiaGV4b1wiO1xuXG50eXBlIGFydGljbGVMaXN0RWxlbWVudCA9IHR5cGVvZiBkYXRhLm1haW5FbnRpdHkuaXRlbUxpc3RFbGVtZW50WzBdO1xuZXhwb3J0IGludGVyZmFjZSBob21lcGFnZUFydGljbGUgZXh0ZW5kcyBPYmplY3RDb25zdHJ1Y3RvciwgYXJ0aWNsZUxpc3RFbGVtZW50IHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5jbGFzcyBzY2hlbWFIb21lcGFnZSB7XG4gIHNjaGVtYSA9IGRhdGE7XG4gIG9wdGlvbnM6IFNjaGVtYUFydGljbGVPcHRpb25zO1xuICBoZXhvOiBUZW1wbGF0ZUxvY2FscztcbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IFNjaGVtYUFydGljbGVPcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmhleG8gPSBvcHRpb25zLmhleG87XG4gICAgLy8gcmVtb3ZlIGRlZmF1bHQgYXJ0aWNsZXNcbiAgICB0aGlzLnNjaGVtYS5tYWluRW50aXR5Lml0ZW1MaXN0RWxlbWVudCA9IFtdO1xuICB9XG5cbiAgYWRkQXJ0aWNsZShhcnRpY2xlOiB7IGF1dGhvcj86IHsgbmFtZT86IHN0cmluZzsgaW1hZ2U/OiBzdHJpbmc7IHVybD86IHN0cmluZyB9OyB0aXRsZTogc3RyaW5nOyBpbWFnZT86IHN0cmluZyB9KSB7XG4gICAgLy8gZ2V0IHNhbXBsZSBkYXRhXG4gICAgY29uc3QgaXRlbSA9IGRhdGEubWFpbkVudGl0eS5pdGVtTGlzdEVsZW1lbnRbMF07XG5cbiAgICAvLyBzZXQgbWV0YWRhdGFcbiAgICBpdGVtLmhlYWRsaW5lID0gYXJ0aWNsZS50aXRsZTtcbiAgICBpZiAodHlwZW9mIGFydGljbGUuaW1hZ2UgPT0gXCJzdHJpbmdcIikgaXRlbS5pbWFnZSA9IGFydGljbGUuaW1hZ2U7XG4gICAgaXRlbS5wb3NpdGlvbiA9IHRoaXMuc2NoZW1hLm1haW5FbnRpdHkuaXRlbUxpc3RFbGVtZW50Lmxlbmd0aC50b1N0cmluZygpO1xuXG4gICAgLy8gc2V0IGF1dGhvciBkYXRhXG4gICAgaWYgKHR5cGVvZiBhcnRpY2xlLmF1dGhvciA9PSBcIm9iamVjdFwiKSB7XG4gICAgICBpZiAodHlwZW9mIGFydGljbGUuYXV0aG9yLmltYWdlID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgaXRlbS5hdXRob3IuaW1hZ2UgPSBhcnRpY2xlLmF1dGhvci5pbWFnZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgYXJ0aWNsZS5hdXRob3IubmFtZSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGl0ZW0uYXV0aG9yLm5hbWUgPSBhcnRpY2xlLmF1dGhvci5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBhcnRpY2xlLmF1dGhvci51cmwgPT0gXCJzdHJpbmdcIiB8fCBBcnJheS5pc0FycmF5KGFydGljbGUuYXV0aG9yLnVybCkpIHtcbiAgICAgICAgaXRlbS5hdXRob3Iuc2FtZUFzID0gYXJ0aWNsZS5hdXRob3IudXJsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY3VzdG9tIHByb3BlcnR5IGFuZCB2YWx1ZVxuICAgKiBAcGFyYW0ga2V5XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5zY2hlbWFba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCBzY2hlbWEgcHJvcGVydHlcbiAgICovXG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5zY2hlbWFba2V5XTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMucHJldHR5KSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5zY2hlbWEsIG51bGwsIDIpO1xuICAgIH1cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5zY2hlbWEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNjaGVtYUhvbWVwYWdlO1xuIl19