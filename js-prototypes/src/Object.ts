/// <reference path="Object.d.ts" />

Object.size = function (obj) {
	let size = 0,
		key: any;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

Object.child = function (str, callback) {
	const self: any = this;
	if (self.hasOwnProperty(str)) {
		if (typeof callback == "function") {
			return callback(self[str]);
		} else {
			return true;
		}
	} else {
		return undefined;
	}
};

Object.alt = function (str, alternative) {
	const self: any = this;
	if (self.hasOwnProperty(str)) {
		return self[str];
	} else {
		return alternative;
	}
};

Object.has = function (str: string | number) {
	return this.hasOwnProperty(str);
};

Object.each = function (callback) {
	for (const key in this) {
		//callback.call(scope, key, this[key]);
		callback.call(this[key]);
	}
};

Object.isEmpty = function () {
	return this.length === 0;
};

/**
 * Join object to separated string
 * @param obj Object
 * @returns Joined string
 */
function object_join(obj: object) {
	return Object.keys(obj)
		.map(function (k) {
			return obj[k];
		})
		.join(",");
}

/**
 * Extend Object
 * @param arg1
 * @param arg2
 * @returns
 */
function extend_object<T1 extends object, T2 extends object>(
	arg1: T1,
	arg2: T2
): T1 & T2 {
	const result: Partial<T1 & T2> = {};
	for (const prop in arg1) {
		if (arg1.hasOwnProperty(prop)) {
			// error when using --strictNullChecks
			(result as T1)[prop] = arg1[prop];
		}
	}
	for (const prop in arg2) {
		if (arg2.hasOwnProperty(prop)) {
			// error when using --strictNullChecks
			(result as T2)[prop] = arg2[prop];
		}
	}
	return result as T1 & T2;
}
