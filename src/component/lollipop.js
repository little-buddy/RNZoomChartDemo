/**
 * Created by buddy on 2019-03-28.
 */

import React from 'react';
import { Circle, Text, G, Polygon, ClipPath } from 'react-native-svg';
import Utils from '../util';
import { VictoryClipContainer } from 'victory-native';
import Decorator from '../decorator';

const withParentRef = (target) => {
	const Component = target;
	return ({ getParent, ...props }) => {
		const parent = getParent();
		const { locationX, _data } = parent;
		return <Component {...props} locationX={locationX} data={_data} />;
	};
};

const { CacheValue } = Decorator;

const CIRCLE_RADIUS_C = 0.7;
const POLYGON_RADIUS_C = 0.25;
const SQRT3 = 1.73;

@withParentRef
export default class Lollipop extends React.Component {
	static defaultProps = {
		width: 100,
		height: 100,
		lollipopStyle: {
			radius: 30,
			color: '#ff8080',
			opacity: 0.7,
		},
	};

	constructor(props) {
		super(props);
		const radius = Math.max(
			Math.ceil(Math.min(props.width, props.height) * 0.05),
			props.lollipopStyle.radius
		);
		this.state = {
			radius,
		};
	}

	@CacheValue()
	getPolygonPoints = (radius) => {
		const height = POLYGON_RADIUS_C * radius;
		const offsetX = (POLYGON_RADIUS_C / SQRT3) * radius;
		const radius2 = 2 * radius;
		return `
		${radius - offsetX},${radius2 - height}
			${radius + offsetX},${radius2 - height} 
			${radius}, ${2 * radius}
			`;
	};

	getApproximationPoint = (
		data: Array<{ x: number, y: number }>,
		scale: { x: Function, y: Function },
		locationX: number
	): {
		x: number,
		y: number,
	} => {
		const { x: xScale } = scale;

		let targetX = xScale.invert(locationX);
		let point = null;

		let index = data.findIndex(({ x }) => x > targetX);

		if (index === 0) {
			point = {
				...data[0],
			};
		} else if (index > 0) {
			const x1 = xScale(data[index - 1].x);
			const x2 = xScale(data[index].x);
			const diff = (x2 - x1) / 2;
			let temp;
			if (locationX - x1 > diff) {
				temp = data[index];
			} else {
				temp = data[index - 1];
			}
			point = { ...temp };
		}

		return point;
	};

	@CacheValue()
	getBoundary = (width, height, padding, offset) => {
		const { top, bottom, left, right } = padding;
		const _bottom = height - bottom - offset;
		const _right = width - right - offset;

		return {
			top: top + offset,
			left: left + offset,
			bottom: _bottom,
			right: _right,
		};
	};

	getPosition = (point, scale, boundary, radius) => {
		const { x: xScale, y: yScale } = scale;
		let locX = xScale(point.x);
		let locY = yScale(point.y);

		const _point = { x: locX - radius, y: locY - radius };

		const direction = Utils.getDirection(boundary, { x: locX, y: locY });

		const { x, y, rotate } = Utils.getPosition(_point, direction, radius);

		return {
			x,
			y,
			rotate,
		};
	};

	render() {
		console.log(this.props);

		if (this.props.data.length < 1 || !this.props.locationX) {
			return null;
		}
		const {
			width,
			height,
			padding,
			data,
			scale,
			locationX,
			lollipopStyle: { opacity },
		} = this.props;
		const { radius } = this.state;

		const point = this.getApproximationPoint(data, scale, locationX);
		if (point === null) {
			return null;
		}

		const polygonPoints = this.getPolygonPoints(radius);

		const boundary = this.getBoundary(width, height, padding, radius);

		const { x, y, rotate } = this.getPosition(point, scale, boundary, radius);

		return (
			<VictoryClipContainer
				width={width}
				height={height}
				padding={padding}
				clipPadding={{ top: 10, right: 10, bottom: 10, left: 10 }}
			>
				<G x={x} y={y}>
					<G
						fill="gray"
						opacity={opacity}
						rotation={rotate}
						origin={`${radius},${radius}`}
					>
						<Circle cx={radius} cy={radius} r={CIRCLE_RADIUS_C * radius} />
						<Polygon points={polygonPoints} />
					</G>
					<G fill="white" x={radius} textAnchor="middle">
						<Text y={radius} fontSize={radius * 0.7}>
							{point.y}
						</Text>
						<Text y={radius + 0.5 * radius} fontSize={radius * 0.4}>
							{Utils.formatMin(point.x)}
						</Text>
					</G>
				</G>
			</VictoryClipContainer>
		);
	}
}
