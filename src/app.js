/**
 * Created by buddy on 2019/3/24.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import ZoomChart from './component/zoomChart';

export default class App extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<ZoomChart />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
