/**
 * Created by buddy on 2019/3/24.
 */

import React from 'react';
import { Text } from 'react-native';
import {
	VictoryChart,
	VictoryZoomContainer,
	VictoryScatter,
	VictoryAxis,
	LineSegment,
	VictoryArea,
	VictoryClipContainer,
} from 'victory-native';
import API from '../api';
import Utils, { NoopComponent } from '../util';
import Lollipop from './lollipop';
import LinearGradient from './linearGradient';
import AxisWrapper from './AxisWrapper';
import _ from 'lodash';

/*
  props<VictoryZoomContianer>{
    allowPan = true,
    allowZoom = true,
    clipContainerComponent = VictoryClipContainer,
    disable = false,
    downsample, 最少可以显示多少个点
    minimunZoom : {x:number,y:number},
    onZoomDomainChange = {(domain,props)=>handelDomainChange(domain,props)},
    zoomDomain : {x:[low,high],y:[low,high]},
    zoomDiemnsion : "x" || "y"
  }
* * */

export default class ZoomChart extends React.Component {
	static defaultProps = {
		lineColor: '#c43a31',
		lineStroke: 2,
		minimumZoom: { x: 5, y: 1 },
	};
	state = {
		bootstrap: false,
	};

	async componentDidMount() {
		const { data } = await API.getZoomChartData();
		this._data = data;
		this.locationX = 0;
		this.setState({ bootstrap: data });
	}

	getDomain = (data, minimumZoom) => {
		let xDomain;
		let yDomain;
		if (data.length === 0) {
			xDomain = [0, 1440];
			yDomain = [60, 200];
		} else if (data.length === 1) {
			const [{ x, y }] = data;
			xDomain = [x - minimumZoom.x, x + minimumZoom.x];
			yDomain = [y - minimumZoom.y, y + minimumZoom.y];
		} else {
			const start = data[0];
			const end = data[data.length - 1];
			xDomain = [start.x, end.x];
			yDomain = Utils.getDomainY(data.map(({ y }) => y));
		}

		return {
			xDomain,
			yDomain,
		};
	};

	handleDomainChange = (domain, props) => {
		this._domain = domain.x;
	};

	// TODO 根据作用域 显示不同的值
	_tickValues = () => {
		const x = this._domain[1] - this._domain[0];
		const count = Math.ceil(x / 60);
		if (count > 12) {
			return _.range(0, 1441, 120);
		} else if (count > 6) {
			return _.range(0, 1441, 60);
		} else if (x < 40) {
			let [start, end] = this._domain;
			start += 5 - (start % 5);
			return _.range(start, end + 1, 5);
		}
		return undefined;
	};

	// TODO 根据作用域 生成不同的格式函数
	xTickFormat = (value, index, data) => {
		if (Math.floor(value) !== value) {
			return '';
		}
		const x = this._domain[1] - this._domain[0];
		let hour = Math.floor(value / 60);
		let min = value % 60;
		hour = Utils.addZero(hour);
		min = Utils.addZero(min);
		if (Math.ceil(x / 60) > 8) {
			return `${hour}`;
		}
		return `${hour}:${min}`;
	};

	render() {
		const { bootstrap } = this.state;
		if (!bootstrap) {
			return null;
		}
		if (bootstrap.message) {
			return <Text>{bootstrap.message}</Text>;
		}

		const { lineColor, lineStroke, minimumZoom } = this.props;
		const { xDomain, yDomain } = this.getDomain(this._data, minimumZoom);
		this._domain = xDomain;

		return (
			<VictoryChart
				minDomain={{ x: 0 }}
				maxDomain={{ x: 1440 }}
				containerComponent={
					<VictoryZoomContainer
						zoomDimension="x"
						onZoomDomainChange={this.handleDomainChange}
						zoomDomain={{ x: xDomain, y: yDomain }}
						minimumZoom={minimumZoom}
						clipContainerComponent={
							<VictoryClipContainer
								clipPadding={{ top: 10, right: 10, bottom: 10, left: 10 }}
							/>
						}
						onTouchStart={(evt) => {
							this.locationX = evt.nativeEvent.locationX;
						}}
					/>
				}
			>
				<LinearGradient />
				<AxisWrapper tickValues={this._tickValues}>
					<VictoryAxis
						axisComponent={<LineSegment lineComponent={<NoopComponent />} />}
						tickFormat={this.xTickFormat}
						style={{
							grid: {
								stroke: 'gray',
								strokeDasharray: '5 5',
							},
						}}
					/>
				</AxisWrapper>
				<VictoryAxis
					dependentAxis
					axisComponent={<LineSegment lineComponent={<NoopComponent />} />}
					style={{
						grid: {
							stroke: 'gray',
							strokeDasharray: '5 5',
						},
					}}
				/>
				<VictoryArea
					data={this._data}
					interpolation="monotoneX"
					style={{
						data: {
							stroke: lineColor,
							strokeWidth: lineStroke,
							fill: LinearGradient.fill,
						},
					}}
				/>
				<VictoryScatter
					data={this._data}
					style={{ data: { stroke: lineColor, fill: lineColor } }}
				/>
				<Lollipop getParent={() => this} />
			</VictoryChart>
		);
	}
}

/*
  最终这里的 animate 是通过 VictoryTransition 进行克隆包裹实现的
  而 VictoryTransition 又 包裹了 VictoryAnimation

  感觉这里的容器其实就是一个触摸控件 + axis的指标

  animate{
    animationWhitelist:[],
    duration:number,
    delay:number,
    easing: "back", "backIn", "backOut", "backInOut", "bounce", "bounceIn", "bounceOut", "bounceInOut", "circle", "circleIn", "circleOut", "circleInOut", "linear", "linearIn", "linearOut", "linearInOut", "cubic", "cubicIn", "cubicOut", "cubicInOut", "elastic", "elasticIn", "elasticOut", "elasticInOut", "exp", "expIn", "expOut", "expInOut", "poly", "polyIn", "polyOut", "polyInOut", "quad", "quadIn", "quadOut", "quadInOut", "sin", "sinIn", "sinOut", "sinInOut",
    onEnd:()=>{},
    onExit:{
      duration:number,
      // 返回的是 style 对象
      before:()=>{},
      after:()=>{}
    },
    onLoad:{}

  }

  props<VictoryLine>{
    animate: boolean || object,
    categories : array[string] || {x:array[string],y:[string}
    containerComponent,
    data,
    dataComponent,
    domain,
    domainPadding,
    eventKey,
    events,
    externalEventMutations,
    groupComponent,
    height,
    width,
    horizontal,
    interpolation, // 插值生成曲线
    // PolarLine basis|cardinal|catmullRom|linear
    // CartesianLine basis|bundle|cardianl|catmullRom|linear|monotoneX|monotoneY|natural|step|stepAfter|stepBefore

    labelComponent,
    labels,
    maxDomain,
    minDomain,
    name,
    origin, // 用于 polar
    padding:{top,bottom,left,right},
    ploar,
    range,
    samples,
    scale, // linear time log sqrt
    sharedEvents,
    singleQuadrantDomainPadding,
    sortKey, // 排序的 key
    sortOrder, // ascending|descending
    standalone,
    style,
    theme,
    x,
    y,
    x0,
    y0,
  }
* */

/*
	对于该架子的 events 事件来说

	target = 'parent' 其实是把对应的事件加入到 Svg上。
	它其实是这样的 通过 eventHandlers 的事件转换成对应的事件函数并附给 组件，而rn中并没有web事件标准，所以仅限于 touchable 的事件响应
	所以它封装出来的仅是通过 事件修改对应值的属性
	若想有一个 同时响应的操作需要淡出处理
	所以想要实现这个东西还是比较繁琐的，该架子用于静态显示还是非常不错的
* * */
