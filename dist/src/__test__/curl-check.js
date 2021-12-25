"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = __importDefault(require("../curl/check"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield (0, check_1.default)("http://google.com")); // true
    console.log(yield (0, check_1.default)("https://www.digitalponsel.com/wp-content/uploads/2018/09/xOnePlus-6-1024x538.jpg.pagespeed.ic.zkfkebn_T3.jpg")); // false
}))();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VybC1jaGVjay5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsic3JjL19fdGVzdF9fL2N1cmwtY2hlY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwREFBa0M7QUFFbEMsQ0FBQyxHQUFTLEVBQUU7SUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBQSxlQUFLLEVBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztJQUN0RCxPQUFPLENBQUMsR0FBRyxDQUNULE1BQU0sSUFBQSxlQUFLLEVBQ1QsOEdBQThHLENBQy9HLENBQ0YsQ0FBQyxDQUFDLFFBQVE7QUFDYixDQUFDLENBQUEsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hlY2sgZnJvbSBcIi4uL2N1cmwvY2hlY2tcIjtcblxuKGFzeW5jICgpID0+IHtcbiAgY29uc29sZS5sb2coYXdhaXQgY2hlY2soXCJodHRwOi8vZ29vZ2xlLmNvbVwiKSk7IC8vIHRydWVcbiAgY29uc29sZS5sb2coXG4gICAgYXdhaXQgY2hlY2soXG4gICAgICBcImh0dHBzOi8vd3d3LmRpZ2l0YWxwb25zZWwuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDE4LzA5L3hPbmVQbHVzLTYtMTAyNHg1MzguanBnLnBhZ2VzcGVlZC5pYy56a2ZrZWJuX1QzLmpwZ1wiXG4gICAgKVxuICApOyAvLyBmYWxzZVxufSkoKTtcbiJdfQ==