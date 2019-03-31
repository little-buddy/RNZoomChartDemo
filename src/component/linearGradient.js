/**
 * Created by buddy on 2019-03-28.
 */

import React from 'react';
import { LinearGradient as SVGLinearGradient, Stop } from 'react-native-svg';

const id = 'gradientColor';
export default class LinearGradient extends React.Component {
	static fill = `url(#${id})`;
	render() {
		return (
			<SVGLinearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
				<Stop offset="0%" stopColor="red" />
				<Stop offset="100%" stopColor="white" />
			</SVGLinearGradient>
		);
	}
}
