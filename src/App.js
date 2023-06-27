import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import * as XLSX from "xlsx";

function App() {
	const [jsonData, setJsonData] = useState(null);

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

		const data1 = jsonData.filter((obj) => obj.id === 313657);
		const withDrank = jsonData.filter((obj) => obj.drank !== undefined);
		const withoutDrank = jsonData.filter(
			(obj) =>
				obj.drank === undefined || obj.drank === " " || obj.drank === "  "
		);

		withoutDrank.map((a) => {
			console.log(a.id);
		});

		console.log(data1);

		console.log(withDrank);
		console.log(withoutDrank);

		// const withDrank = dataset.reduce((result, entry) => {
		// 	if ("drank" in entry) {
		// 		result.push(entry);
		// 	}
		// 	return result;
		// }, []);

		// const withoutDrank = dataset.reduce((result, entry) => {
		// 	if (!("drank" in entry)) {
		// 		result.push(entry);
		// 	}
		// 	return result;
		// }, []);

		for (let index = 0; index < withoutDrank.length; index++) {
			const elementwithout = withoutDrank[index];
			for (let index = 0; index < withDrank.length - 1; index++) {
				const element = withDrank[index];
				const element2 = withDrank[index + 1];
				if (
					elementwithout.ogrank > element.ogrank &&
					elementwithout.ogrank < element2.ogrank
				) {
					if (
						!containsLettersAndNumbers(element.drank) &&
						!containsLettersAndNumbers(element2.drank)
					) {
						elementwithout["drank"] = element2.drank + "a";
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
						elementwithout["drank"] = element2.drank + "a";
						withDrank.splice(index + 1, 0, elementwithout);
					}
				}
			}
		}

		console.log(withDrank.sort((a, b) => a.ogrank - b.ogrank));
		exportToExcel(
			withDrank.sort((a, b) => a.ogrank - b.ogrank),
			"Abcdranklist.xlsx"
		);
	};

	return (
		<div className="App">
			<Sidebar />
			<div className="page">
				<Navbar />
				<div className="pagedata">
					<span className="pagetitle">ABCE Ranking System</span>
					<div>
						<input
							type="file"
							accept=".xlsx, .xls"
							onChange={handleFileUpload}
						/>
						{jsonData && (
							<button
								onClick={() => {
									pushlot();
								}}
							>
								Convert & Donwload
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
