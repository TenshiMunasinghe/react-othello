import React, {Component} from "react";
import AnimateOnChange from "react-animate-on-change";

export default class Grid extends Component {
	state = {
		content: "",
		isChanged: false
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		const isChanged = nextProps.content !== prevState.content;
		return {content: nextProps.content, isChanged};
	}

	render() {
		console.log(this.state.isChanged);

		const {x, y, id, handleChange, handleHover} = this.props;
		return (
			<div
				className='grid-item'
				id={id}
				onClick={() => {
					handleChange(y, x);
				}}
				onMouseOver={e => {
					handleHover(y, x, e);
				}}>
				<AnimateOnChange
					baseClassName='content'
					animationClassName='content-changed'
					animate={this.state.isChanged}>
					{this.state.content}
				</AnimateOnChange>
			</div>
		);
	}
}
