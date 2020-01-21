import React from "react";

export default function Grid({x, y, id, content, handleChange, handleHover}) {
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
			{content}
		</div>
	);
}
