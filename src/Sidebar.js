import React from "react";
import { AiFillHome } from "react-icons/ai";

export const Sidebar = () => {
	return (
		<div className="sidebar">
			<span className="sidebart1">TNEA ABCD</span>
			<span className="sidebart2">Dynamic Ranking Portal</span>
			<div className="divider" style={{ marginBottom: "55px" }}></div>
			<div className="sidebaroption">
				<AiFillHome />
				<span>Home</span>
			</div>
		</div>
	);
};
