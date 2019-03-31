/**
 * Created by buddy on 2019-03-26.
 */

import { DIRECTION_TYPE, POSITION_TYPE } from '../constant';

export const noop = () => {};
export const NoopComponent = () => null;

const formatMin = (value) => {
	let hour = Math.floor(value / 60);
	let min = value % 60;
	hour = hour < 10 ? `0${hour}` : hour;
	min = min < 10 ? `0${min}` : min;
	return `${hour}:${min}`;
};

const addZero = (value) => (value < 10 ? `0${value}` : value);

const getDomainY = (items, min = 60, max = 220) => {
	const len = items.length;
	if (len === 0) {
		return [min, max];
	}

	if (len === 1) {
		const [x] = items;
		return [x - 50, x + 50];
	}

	let result;
	items.sort((a, b) => {
		if (a > b) {
			return 1;
		} else if (a < b) {
			return -1;
		}
		return 0;
	});
	result = [items[0], items[len - 1]];

	if (min !== null && max !== null) {
		result = [
			result[0] > min ? min : result[0],
			result[1] < max ? max : result[1],
		];
	}
	return result;
};

/* lollipop */
const getDirection = (outBoundary, point) => {
	const { top, bottom, left, right } = outBoundary;
	const { x, y } = point;

	const direction = [];
	if (y < top) {
		direction.push(DIRECTION_TYPE.BOTTOM);
	}
	if (x > right) {
		direction.push(DIRECTION_TYPE.LEFT);
	}
	if (y > bottom) {
		direction.push(DIRECTION_TYPE.TOP);
	}
	if (x < left) {
		direction.push(DIRECTION_TYPE.RIGHT);
	}
	let posKey = DIRECTION_TYPE.TOP;
	if (direction.length === 1) {
		posKey = direction[0];
	}
	if (direction.length === 2) {
		posKey = direction.join('_');
		if (!(posKey in POSITION_TYPE)) {
			posKey = direction.reverse().join('_');
		}
	}
	return posKey;
};

const Sin = (deg) => Math.sin((Math.PI / 180) * deg);
const Cos = (deg) => Math.cos((Math.PI / 180) * deg);

// 旋转是顺时针的
const getPosition = (point, direction, radius) => {
	let rotate = 0;
	switch (direction) {
		case DIRECTION_TYPE.TOP_LEFT:
			rotate = -45;
			break;
		case DIRECTION_TYPE.LEFT:
			rotate = -90;
			break;
		case DIRECTION_TYPE.BOTTOM_LEFT:
			rotate = -135;
			break;
		case DIRECTION_TYPE.BOTTOM:
			rotate = 180;
			break;
		case DIRECTION_TYPE.BOTTOM_RIGHT:
			rotate = 135;
			break;
		case DIRECTION_TYPE.RIGHT:
			rotate = 90;
			break;
		case DIRECTION_TYPE.TOP_RIGHT:
			rotate = 45;
			break;
		default:
			rotate: 0;
	}

	const x = Cos(rotate - 90) * radius + point.x;
	const y = Sin(rotate - 90) * radius + point.y;

	return {
		x,
		y,
		rotate,
	};
};

export default {
	formatMin,
	addZero,
	getDomainY,
	getDirection,
	getPosition,
};
