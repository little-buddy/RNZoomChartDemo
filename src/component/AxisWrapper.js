/**
 * Created by buddy on 2019-03-31.
 */

import React from 'react';
import _ from 'lodash';

export default (AxisWrapper = () => {
	const children = React.Children.toArray(this.props.children);
	return children.map((child, index) => {
		let { tickValues } = this.props;
		if (_.isFunction(tickValues)) {
			tickValues = tickValues();
		}
		const style = _.merge(child.props.style, this.props.style);
		return React.cloneElement(child, {
			...child.props,
			...this.props,
			style,
			tickValues,
		});
	});
});
