import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import * as XLSX from "xlsx";

function App() {
	const [jsonData, setJsonData] = useState(null);
	const [BC, setBC] = useState(false);
	const [BCM, setBCM] = useState(false);
	const [MBC, setMBC] = useState(false);
	const [SC, setSC] = useState(false);
	const [SCA, setSCA] = useState(false);
	const [ST, setST] = useState(false);

	function countAlphabets(string) {
		let count = 0;
		for (let i = 0; i < string.length; i++) {
			if (/[a-zA-Z]/.test(string[i])) {
				count++;
			}
		}
		return count;
	}

	function incrementLastCharacter(str) {
		var lastChar = str.charAt(str.length - 1);

		// Check if the last character is a letter
		if (/[a-zA-Z]/.test(lastChar)) {
			// Increment the letter by converting it to its ASCII code,
			// incrementing the code, and converting it back to a character
			var incrementedChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);

			// Replace the last character with the incremented one
			return str.slice(0, -1) + incrementedChar;
		}

		return str;
	}

	function containsLettersAndNumbers(str) {
		// Regular expressions to match letters and numbers
		var letterRegex = /[a-zA-Z]/;
		var numberRegex = /[0-9]/;

		// Test if the string contains both letters and numbers
		return letterRegex.test(str) && numberRegex.test(str);
	}

	const dataset2 = [
		{ id: 1, ogrank: 1600, drank: 1600 },
		{ id: 2, ogrank: 1602, drank: 1601 },
		{ id: 4, ogrank: 1606, drank: 1603 },
		{ id: 3, ogrank: 1603, drank: 1602 },
		{ id: 3, ogrank: 1601 },
		{ id: 3, ogrank: 1605 },
		{ id: 3, ogrank: 1604 }
	];

	const dataset = [
		{ id: 1, ogrank: 1600, drank: 1600 },
		{ id: 2, ogrank: 1601, drank: "1601a" },
		{ id: 3, ogrank: 1602, drank: 1601 },
		{ id: 4, ogrank: 1603, drank: 1602 },
		{ id: 5, ogrank: 1605, drank: "1603a" },
		{ id: 6, ogrank: 1606, drank: "1603b" },
		{ id: 7, ogrank: 1607, drank: 1603 },
		{ id: 10, ogrank: 1604 }
	];

	function exportToExcel(dataArray, filename) {
		const worksheet = XLSX.utils.json_to_sheet(dataArray);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
		XLSX.writeFile(workbook, filename);
	}

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onload = (e) => {
			const data = new Uint8Array(e.target.result);
			const workbook = XLSX.read(data, { type: "array" });
			const worksheet = workbook.Sheets[workbook.SheetNames[0]];
			const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

			const headers = jsonData[0];
			const convertedData = jsonData.slice(1).map((row) => {
				const obj = {};
				headers.forEach((header, index) => {
					obj[header] = row[index];
				});
				return obj;
			});

			setJsonData(convertedData);
			console.log(convertedData);
		};

		reader.readAsArrayBuffer(file);
	};

	const pushlot = () => {
		jsonData.sort((a, b) => a.ogrank - b.ogrank);

		console.log(jsonData);

		const validusers = jsonData.filter(
			(obj) =>
				obj.ogrank !== undefined && obj.ogrank !== " " && obj.ogrank !== "  "
		);

		const invalidusers = jsonData.filter(
			(obj) =>
				obj.ogrank === undefined && obj.ogrank === " " && obj.ogrank === "  "
		);

		const withDrank = validusers.filter(
			(obj) =>
				obj.drank !== undefined && obj.drank !== " " && obj.drank !== "  "
		);
		const withoutDrank = validusers.filter(
			(obj) =>
				obj.drank === undefined || obj.drank === " " || obj.drank === "  "
		);

		console.log(withDrank);
		console.log(withoutDrank);

		for (let index = 0; index < withoutDrank.length; index++) {
			const elementwithout = withoutDrank[index];
			for (let index = 0; index < withDrank.length - 1; index++) {
				const element = withDrank[index];
				const element2 = withDrank[index + 1];
				if (
					elementwithout.ogrank > element.ogrank &&
					elementwithout.ogrank < element2.ogrank
				) {
					console.log("yes");
					if (
						!containsLettersAndNumbers(element.drank) &&
						!containsLettersAndNumbers(element2.drank)
					) {
						elementwithout["drank"] = element.drank + "a";
						withDrank.splice(index + 1, 0, elementwithout);
					}
					if (
						!containsLettersAndNumbers(element.drank) &&
						containsLettersAndNumbers(element2.drank)
					) {
						elementwithout["drank"] = element2.drank + "a";
						withDrank.splice(index + 1, 0, elementwithout);
					}
					if (
						containsLettersAndNumbers(element.drank) &&
						!containsLettersAndNumbers(element2.drank)
					) {
						elementwithout["drank"] = incrementLastCharacter(element.drank);
						withDrank.splice(index + 1, 0, elementwithout);
					}
					if (
						containsLettersAndNumbers(element.drank) &&
						containsLettersAndNumbers(element2.drank)
					) {
						if (
							countAlphabets(element.drank) > 1 &&
							countAlphabets(element2.drank) == 1
						) {
							elementwithout["drank"] = incrementLastCharacter(element.drank);
							withDrank.splice(index + 1, 0, elementwithout);
						} else {
							elementwithout["drank"] = element2.drank + "a";
							withDrank.splice(index + 1, 0, elementwithout);
						}
					}
				}
			}
		}

		console.log(withDrank.sort((a, b) => a.ogrank - b.ogrank));
		withDrank.concat(invalidusers);
		exportToExcel(
			withDrank.sort((a, b) => a.ogrank - b.ogrank),
			"Abcdranklist.xlsx"
		);
	};

	const pushlotcommunity = () => {
		jsonData.sort((a, b) => a.ogrank - b.ogrank);

		console.log(jsonData);

		var validusers = jsonData.filter(
			(obj) =>
				obj["rk.cr"] !== undefined &&
				obj["rk.cr"] !== " " &&
				obj["rk.cr"] !== "  "
		);

		var invalidusers = jsonData.filter(
			(obj) =>
				obj["rk.cr"] === undefined &&
				obj["rk.cr"] === " " &&
				obj["rk.cr"] === "  "
		);

		// const SCAdata = validusers.filter((obj) => obj["_p.co"] === "SCA");
		// const STdata = validusers.filter((obj) => obj["_p.co"] === "ST");
		// const nBCMdata = validusers.filter((obj) => obj["_p.co"] != "BCM");
		// const nMBCdata = validusers.filter((obj) => obj["_p.co"] != "MBC");
		// const nSCdata = validusers.filter((obj) => obj["_p.co"] != "SC");
		// const nSCAdata = validusers.filter((obj) => obj["_p.co"] != "SCA");
		// const nSTdata = validusers.filter((obj) => obj["_p.co"] != "ST");

		if (BC) {
			const BCdata = validusers.filter((obj) => obj["_p.co"] === "BC");
			const nBCdata = validusers.filter((obj) => obj["_p.co"] != "BC");

			var BCdatar = commonpusher(BCdata);
			validusers = BCdatar.concat(nBCdata);
		}
		if (BCM) {
			const BCMdata = validusers.filter((obj) => obj["_p.co"] === "BCM");
			const nBCMdata = validusers.filter((obj) => obj["_p.co"] != "BCM");

			var BCMdatar = commonpusher(BCMdata);
			validusers = BCMdatar.concat(nBCMdata);
		}
		if (MBC) {
			const MBCdata = validusers.filter((obj) => obj["_p.co"] === "MBC");
			const nMBCdata = validusers.filter((obj) => obj["_p.co"] != "MBC");

			var MBCdatar = commonpusher(MBCdata);
			validusers = MBCdatar.concat(nMBCdata);
		}
		if (ST) {
			const STdata = validusers.filter((obj) => obj["_p.co"] === "ST");
			const nSTdata = validusers.filter((obj) => obj["_p.co"] != "ST");

			var STdatar = commonpusher(STdata);
			validusers = STdatar.concat(nSTdata);
		}
		if (SC) {
			const SCdata = validusers.filter((obj) => obj["_p.co"] === "SC");
			const nSCdata = validusers.filter((obj) => obj["_p.co"] != "SC");

			var SCdatar = commonpusher(SCdata);
			validusers = SCdatar.concat(nSCdata);
		}
		if (SCA) {
			const SCAdata = validusers.filter((obj) => obj["_p.co"] === "SCA");
			const nSCAdata = validusers.filter((obj) => obj["_p.co"] != "SCA");

			var SCAdatar = commonpusher(SCAdata);
			validusers = SCAdatar.concat(nSCAdata);
		}

		validusers.concat(invalidusers);
		exportToExcel(
			validusers.sort((a, b) => a.ogrank - b.ogrank),
			"Community_fixed.xlsx"
		);
	};

	const commonpusher = (validusers) => {
		const withDrank = validusers.filter(
			(obj) =>
				obj["rkd.cr"] !== undefined &&
				obj["rkd.cr"] !== " " &&
				obj["rkd.cr"] !== "  " &&
				obj["rkd.cr"] !== "-1" && 
				obj["rkd.cr"] !== -1 
		);
		const withoutDrank = validusers.filter(
			(obj) =>
				obj["rkd.cr"] === undefined ||
				obj["rkd.cr"] === " " ||
				obj["rkd.cr"] === "  " ||
				obj["rkd.cr"] === "-1" || 
				obj["rkd.cr"] === -1

		);

		console.log(withDrank);
		console.log(withoutDrank);

		for (let index = 0; index < withoutDrank.length; index++) {
			const elementwithout = withoutDrank[index];
			for (let index = 0; index < withDrank.length - 1; index++) {
				const element = withDrank[index];
				const element2 = withDrank[index + 1];
				if (
					elementwithout["rk.cr"] > element["rk.cr"] &&
					elementwithout["rk.cr"] < element2["rk.cr"]
				) {
					console.log("yes");
					if (
						!containsLettersAndNumbers(element["rkd.cr"]) &&
						!containsLettersAndNumbers(element2["rkd.cr"])
					) {
						elementwithout["rkd.cr"] = element["rkd.cr"] + "a";
						withDrank.splice(index + 1, 0, elementwithout);
					}
					if (
						!containsLettersAndNumbers(element["rkd.cr"]) &&
						containsLettersAndNumbers(element2["rkd.cr"])
					) {
						elementwithout["rkd.cr"] = element2["rkd.cr"] + "a";
						withDrank.splice(index + 1, 0, elementwithout);
					}
					if (
						containsLettersAndNumbers(element["rkd.cr"]) &&
						!containsLettersAndNumbers(element2["rkd.cr"])
					) {
						elementwithout["rkd.cr"] = incrementLastCharacter(
							element["rkd.cr"]
						);
						withDrank.splice(index + 1, 0, elementwithout);
					}
					if (
						containsLettersAndNumbers(element["rkd.cr"]) &&
						containsLettersAndNumbers(element2["rkd.cr"])
					) {
						if (
							countAlphabets(element["rkd.cr"]) > 1 &&
							countAlphabets(element2["rkd.cr"]) == 1
						) {
							elementwithout["rkd.cr"] = incrementLastCharacter(
								element["rkd.cr"]
							);
							withDrank.splice(index + 1, 0, elementwithout);
						} else {
							elementwithout["rkd.cr"] = element2["rkd.cr"] + "a";
							withDrank.splice(index + 1, 0, elementwithout);
						}
					}
				}
			}
		}

		console.log(withDrank.sort((a, b) => a["rk.cr"] - b["rk.cr"]));
		// withDrank.concat(invalidusers);
		// exportToExcel(
		// 	withDrank.sort((a, b) => a["rk.cr"] - b["rk.cr"]),
		// 	"Abcdranklist.xlsx"
		// );
		return withDrank.sort((a, b) => a["rk.cr"] - b["rk.cr"]);
	};

	return (
		<div className="App">
			<Sidebar />
			<div className="page">
				<Navbar />
				<div className="pagedata">
					<span className="pagetitle">ABCE Ranking System</span>
					<div style={{ marginBottom: "40px" }}>
						<input
							type="file"
							accept=".xlsx, .xls,.csv"
							onChange={handleFileUpload}
						/>
						{jsonData && (
							<button
								onClick={() => {
									pushlot();
								}}
							>
								Donwload General
							</button>
						)}
					</div>
					{jsonData && (
						<div>
							<span className="pagetitle" style={{ marginBottom: "40px" }}>
								Select Community
							</span>
							<div
								style={{
									display: "flex",
									marginBottom: "20px",
									marginTop: "30px"
								}}
							>
								<div>
									{" "}
									<input
										onChange={(e) => {
											setBC(!BC);
										}}
										type="checkbox"
										className="checker"
									/>{" "}
									<span>BC</span>
								</div>
								<div>
									{" "}
									<input
										onChange={(e) => {
											setBCM(!BCM);
										}}
										type="checkbox"
										className="checker"
									/>{" "}
									<span>BCM</span>
								</div>
								<div>
									{" "}
									<input
										onChange={(e) => {
											setMBC(!MBC);
										}}
										type="checkbox"
										className="checker"
									/>{" "}
									<span>MBC</span>
								</div>
								<div>
									{" "}
									<input
										onChange={(e) => {
											setSC(!SC);
										}}
										type="checkbox"
										className="checker"
									/>{" "}
									<span>SC</span>
								</div>
								<div>
									{" "}
									<input
										onChange={(e) => {
											setSCA(!SCA);
										}}
										type="checkbox"
										className="checker"
									/>{" "}
									<span>SCA</span>
								</div>
								<div>
									{" "}
									<input
										onChange={(e) => {
											setST(!ST);
										}}
										type="checkbox"
										className="checker"
									/>{" "}
									<span>ST</span>
								</div>
							</div>
							<button
								onClick={() => {
									if (!(BC || BCM || MBC || ST || SC || SCA)) {
									} else {
										pushlotcommunity();
									}
								}}
							>
								Download Community
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
