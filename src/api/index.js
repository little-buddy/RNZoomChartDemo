/**
 * Created by buddy on 2019-03-26.
 */

import { ZOOM_CHART_DATA_URL } from '../constant';

const getZoomChartData = async () => {
	let res = null;
	try {
		res = await fetch(ZOOM_CHART_DATA_URL, { method: 'get' });
		res = await res.json();
		let { data } = res;
		data = data.map((item) => ({
			x: item.minute,
			y: item.value,
		}));

		res.data = data;
	} catch (e) {
		res = { message: `Fetching Error : ${e.message}`, code: 512 };
	}
	return res;
};

export default {
	getZoomChartData,
};
