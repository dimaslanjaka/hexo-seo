/* eslint-disable */
declare interface Number {
    getMS(type: string): number;

    /**
     * Get X Hour from date
     * @return number ms from Date().getTime()
     * @example
     * get `1 hour from current Date()`
     * 1.addHour()
     * get `1 hour from spesific Date()`
     * 1.addHour(new Date('2020-06-04 01:10:53'))
     */
    addHour(source: Date | null): number;

    /**
     * add zero leading
     * @param add
     * @param target
     */
    AddZero(add: number, target: string): number;
}

Number.prototype.getMS = function (type) {
    const self = this;
    return this * 60 * 1000;
};

Number.prototype.addHour = function (source) {
    const self = this;
    const Hour = this * 60 * 1000; /* ms */
    if (!source) source = new Date();
    return new Date(source.getTime() + Hour).getTime();
};

Number.prototype.AddZero = function (b, c) {
    const l = String(b || 10).length - String(this).length + 1;
    return l > 0 ? new Array(l).join(c || "0") + this : this;
};

/**
 * Odd or Even (Ganjil Genap);
 * @param n
 * @param type odd or even
 */
function oddoreven(n: string, type: string) {
    if (!type) {
        type = "odd";
    }
    const time = !n ? new Date().getDay() : Number(n);

    if (!/^-?\d+jQuery/.test(time.toString())) {
        alert("arguments is not number, please remove quote");
        return null;
    }

    const hasil = time % 2;

    const rType = /^(odd|ganjil)$/.test(type) ? "1" : "0";
    //return hasil == (type == ('odd' || 'ganjil') ? 1 : 0);

    return hasil.toString() == rType.toString();
}

/**
 * strpad / startwith zero [0]
 * @param {number} val
 */
function strpad(val: number) {
    if (val >= 10) {
        return val;
    } else {
        return "0" + val;
    }
}
