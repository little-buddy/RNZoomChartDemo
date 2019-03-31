/**
 * Created by buddy on 2019-03-30.
 */

import { isEqual } from 'lodash';

const CacheValue = () => {
	const memo = {};
	return (target, name, descriptor) => {
		const originFn = descriptor.value;
		descriptor.value = (...args) => {
			if (isEqual(memo.argument, args)) {
				return memo.value;
			} else {
				memo.argument = args;
			}
			const value = originFn(...args);
			memo.value = value;
			return value;
		};

		return descriptor;
	};
};

export default {
	CacheValue,
};
