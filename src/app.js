/**
 * Created by buddy on 2019/3/24.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import ZoomChart from './component/zoomChart';

/* App */
export default () => {
	return (
		<View style={styles.container}>
			<ZoomChart />
		</View>
	);
};

/*
		<StoreContext.Provider value={store}>
				{childrend}
		</StoreContext.Provider>
* * */

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
