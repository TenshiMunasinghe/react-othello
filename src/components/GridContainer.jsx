import React, {Component} from "react";
import Grid from "./Grid";

const white = "\u25CB";
const black = "\u25CF";
const directions = [
	{
		x: -1,
		y: -1
	},
	{
		x: 0,
		y: -1
	},
	{
		x: 1,
		y: -1
	},
	{
		x: -1,
		y: 0
	},
	{
		x: 1,
		y: 0
	},
	{
		x: -1,
		y: 1
	},
	{
		x: 0,
		y: 1
	},
	{
		x: 1,
		y: 1
	}
];

export default class GridContainer extends Component {
	state = {
		grids: [],
		current: "white"
	};

	componentDidMount = () => {
		//create grid
		let grids = [];
		for (let y = 1; y < 9; y++) {
			for (let x = 1; x < 9; x++) {
				let content = "";
				if ((x === 4 || x === 5) && x === y) {
					content = white;
				} else if ((x === 4 && y === 5) || (x === 5 && y === 4)) {
					content = black;
				}
				grids.push({
					content: content,
					y: y,
					x: x
				});
			}
		}
		this.setState({grids});
	};

	handleHover = (y, x, e) => {
		const {current} = this.state;
		const currentColor = current === "white" ? white : black;
		const toFlip = current === "white" ? black : white;
		const canFlip = this.checkFlip(y, x, toFlip, currentColor);
		canFlip.length === 0
			? e.target.classList.add("hover")
			: e.target.classList.remove("hover");
	};

	handleChange = (y, x) => {
		const {current, grids} = this.state;
		const next = current === "white" ? "black" : "white";
		const currentColor = current === "white" ? white : black;
		const toFlip = current === "white" ? black : white;
		const emptyGrids = grids.filter(e => e.content === "");
		const clickedGrid = grids.find(e => e.y === y && e.x === x);
		const canFlip = this.checkFlip(y, x, toFlip, currentColor);
		let canFlipAll = [];

		for (const grid of emptyGrids) {
			const tempCanFlipCurrent = this.checkFlip(
				grid.y,
				grid.x,
				toFlip,
				currentColor
			);
			canFlipAll.push(...tempCanFlipCurrent);
		}
		if (canFlipAll.length === 0) {
			alert("No available grid for placement passing turn.");
			this.setState({current: next});
			return;
		}
		if (clickedGrid.content !== "") return;
		if (canFlip.length === 0) return;

		this.setState(
			prev => {
				let grids = [...prev.grids];
				grids = grids.map(e => {
					if (!(e.y === y && e.x === x)) return e;

					let tempE = {...e};
					const currentColor = prev.current === "white" ? white : black;
					tempE.content = currentColor;
					return tempE;
				});
				return {grids};
			},
			() => this.flipPieces(canFlip)
		);
	};

	flipPieces = canFlip => {
		const {current, grids} = this.state;
		const next = current === "white" ? "black" : "white";
		const currentColor = current === "white" ? white : black;

		let tempGrids = [...grids];
		for (const flip of canFlip) {
			tempGrids = tempGrids.map(e => {
				if (e.y === flip.y && e.x === flip.x) {
					let tempE = {...e};
					tempE.content = currentColor;
					return tempE;
				}
				return e;
			});
		}
		this.setState({grids: tempGrids, current: next});
	};

	checkFlip = (y, x, toFlip, currentColor) => {
		let willFlip = [];
		for (const dir of directions) {
			let tempArr = [];
			for (let i = 1; i < 9; i++) {
				const coordinate = {
					currentX: x + i * dir.x,
					currentY: y + i * dir.y
				};
				const currentGrid = this.state.grids.find(
					e => e.y === coordinate.currentY && e.x === coordinate.currentX
				);
				if (!currentGrid || currentGrid.content === "") break;
				if (currentGrid.content === toFlip) tempArr.push(currentGrid);
				if (currentGrid.content === currentColor) {
					willFlip.push(...tempArr);
					break;
				}
			}
		}
		return willFlip;
	};

	checkWin = () => {
		const {grids} = this.state;
		const emptyGrids = grids.filter(e => e.content === "");
		if (emptyGrids.length === 0) return true;

		const whiteGrids = grids.filter(e => e.content === white).length;
		const blackGrids = grids.filter(e => e.content === black).length;
		if (whiteGrids === 0 || blackGrids === 0) return true;

		let canFlipWhite = [];
		let canFlipBlack = [];
		for (const grid of emptyGrids) {
			const tempCanFlipWhite = this.checkFlip(grid.y, grid.x, black, white);
			const tempCanFlipBlack = this.checkFlip(grid.y, grid.x, white, black);
			canFlipWhite.push(...tempCanFlipWhite);
			canFlipBlack.push(...tempCanFlipBlack);
		}
		if (canFlipBlack.length === 0 && canFlipWhite === 0) return true;

		return false;
	};

	render() {
		const {grids, current} = this.state;
		const whiteGrids = grids.filter(e => e.content === white).length;
		const blackGrids = grids.filter(e => e.content === black).length;
		//create elements according to the array in state.
		const gridElement = grids.map(e => {
			return (
				<Grid
					key={`${e.y}${e.x}`}
					id={`${e.y}${e.x}`}
					y={e.y}
					x={e.x}
					content={e.content}
					handleChange={this.handleChange}
					handleHover={this.handleHover}
				/>
			);
		});

		const text = this.checkWin()
			? whiteGrids === blackGrids
				? `draw`
				: whiteGrids > blackGrids
				? `white wins`
				: "black wins"
			: `current: ${current}`;

		return (
			<>
				<h6>{text}</h6>
				<div className='grid'>{gridElement}</div>
			</>
		);
	}
}
