/**
 * Created by buddy on 2019-03-26.
 */

/* api */
export const ZOOM_CHART_DATA_URL = 'http://localhost:8081/src/data.json';

/* direction */
export const DIRECTION_TYPE = {
	TOP: 'TOP',
	BOTTOM: 'BOTTOM',
	RIGHT: 'RIGHT',
	LEFT: 'LEFT',
	TOP_RIGHT: 'TOP_RIGHT',
	TOP_LEFT: 'TOP_LEFT',
	BOTTOM_RIGHT: 'BOTTOM_RIGHT',
	BOTTOM_LEFT: 'BOTTOM_LEFT',
};

export const POSITION_TYPE = {
	[DIRECTION_TYPE.TOP]: [0, -1],
	[DIRECTION_TYPE.TOP_RIGHT]: [1, -1],
	[DIRECTION_TYPE.RIGHT]: [1, 0],
	[DIRECTION_TYPE.BOTTOM_RIGHT]: [1, 1],
	[DIRECTION_TYPE.BOTTOM]: [0, 1],
	[DIRECTION_TYPE.BOTTOM_LEFT]: [-1, 1],
	[DIRECTION_TYPE.LEFT]: [-1, 0],
	[DIRECTION_TYPE.TOP_LEFT]: [-1, -1],
};
