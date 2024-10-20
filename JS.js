document.addEventListener("DOMContentLoaded", function () {
	const processOptions = [
		"Kuster CPB",
		"Goller CPB",
		"Shirting CPB",
		"Pad Dry",
		"E-Control",
	];

	const stages = {
		CPB: ["Padding", "Rota", "Washing", "Drying"],
		PDPS: ["Padding", "Drying", "Developing", "Drying"],
		"E-Control": ["Padding", "E-Control", "Washing", "Drying"],
		Vat: ["Padding", "Drying", "Developing", "Drying"],
		Thermosol: ["Padding", "Drying", "Heat Set", "Carbonize", "Drying"],
		"Single Bath Vat": [
			"Padding",
			"Drying",
			"Heat Set",
			"Developing",
			"Drying",
			"Carbonize",
			"Drying",
		],
		"Perma White": ["Padding", "Rota", "Washing", "Drying"],
	};

	const processList = [];
	const developedList = [];

	const machineSelectionContainer = document.getElementById(
		"machineSelectionContainer"
	);
	const routeSelectionContainer = document.getElementById(
		"routeSelectionContainer"
	);
	const processListContainer = document.getElementById("processListContainer");
	const developedListContainer = document.getElementById(
		"developedListContainer"
	);
	const inputValueElement = document.getElementById("inputValue");
	const addProcessBtn = document.getElementById("addProcessBtn");

	let selectedMachine = null;
	let selectedRoute = null;

	processOptions.forEach((machine) => {
		const machineDiv = document.createElement("div");
		machineDiv.innerText = machine;
		machineDiv.addEventListener("click", () => {
			selectedMachine = machine;
			document
				.querySelectorAll("#machineSelectionContainer div")
				.forEach((div) => div.classList.remove("selected-machine"));
			machineDiv.classList.add("selected-machine");
			updateRouteOptions();
		});
		machineSelectionContainer.appendChild(machineDiv);
	});

	const updateRouteOptions = () => {
		routeSelectionContainer.innerHTML = "";
		const routeOptions =
			selectedMachine &&
			["Kuster CPB", "Goller CPB", "Shirting CPB"].includes(selectedMachine)
				? ["CPB", "Perma White"]
				: ["PDPS", "E-Control", "Vat", "Thermosol", "Single Bath Vat"];

		routeOptions.forEach((route) => {
			const routeDiv = document.createElement("div");
			routeDiv.innerText = route;
			routeDiv.addEventListener("click", () => {
				selectedRoute = route;
				document
					.querySelectorAll("#routeSelectionContainer div")
					.forEach((div) => div.classList.remove("selected-machine"));
				routeDiv.classList.add("selected-machine");
			});
			routeSelectionContainer.appendChild(routeDiv);
		});
	};

	const addProcessEntry = () => {
		if (!selectedMachine || !selectedRoute || !inputValueElement.value) {
			alert("Please select a machine, a route and enter a tank number.");
			return;
		}

		const processStages = stages[selectedRoute];
		const newProcess = {
			machine: selectedMachine,
			tankNo: inputValueElement.value,
			route: selectedRoute,
			stages: processStages,
			stageIndex: 0,
			stageTime: 0,
			totalTime: 0,
			intervalId: setInterval(() => {
				newProcess.stageTime++;
				newProcess.totalTime++;
				renderProcessList();
			}, 1000),
		};

		processList.push(newProcess);
		renderProcessList();
	};

	const renderProcessList = () => {
		processListContainer.innerHTML = "";
		processList.forEach((process, index) => {
			const processDiv = document.createElement("div");
			processDiv.className = "process-list-item";

			const machineInfo = document.createElement("div");
			machineInfo.innerHTML = <strong>${process.machine}</strong> - ${process.tankNo} (<em>${process.route}</em>);

			const stageClock = document.createElement("div");
			stageClock.innerText = `Current Stage: ${
				process.stages[process.stageIndex]
			} - Time: ${formatTime(process.stageTime)}`;

			const totalClock = document.createElement("div");
			totalClock.innerText = Total Time: ${formatTime(process.totalTime)};

			const nextStageBtn = document.createElement("button");
			nextStageBtn.innerText = "Next Stage";
			nextStageBtn.onclick = () => {
				process.stageIndex++;
				process.stageTime = 0;
				if (process.stageIndex >= process.stages.length - 1) {
					clearInterval(process.intervalId);
				}
				renderProcessList();
			};

			const deleteBtn = document.createElement("button");
			deleteBtn.innerText = "Delete";
			deleteBtn.onclick = () => {
				clearInterval(process.intervalId);
				processList.splice(index, 1);
				renderProcessList();
			};

			const developedBtn = document.createElement("button");
			developedBtn.innerText = "Developed";
			developedBtn.onclick = () => {
				clearInterval(process.intervalId);
				moveToDevelopedSection(process);
				processList.splice(index, 1);
				renderProcessList();
			};

			processDiv.appendChild(machineInfo);
			processDiv.appendChild(stageClock);
			processDiv.appendChild(totalClock);
			processDiv.appendChild(nextStageBtn);
			processDiv.appendChild(deleteBtn);
			processDiv.appendChild(developedBtn);

			processListContainer.appendChild(processDiv);
		});
	};

	const moveToDevelopedSection = (process) => {
		const completedTime = new Date().toLocaleString("en-IN", {
			timeZone: "Asia/Kolkata",
		});
		process.developedTime = completedTime;
		developedList.push(process);
		renderDevelopedList();
	};

	const renderDevelopedList = () => {
		developedListContainer.innerHTML = "";
		developedList.forEach((process) => {
			const processDiv = document.createElement("div");
			processDiv.className = "developed-list-item";

			const machineInfo = document.createElement("div");
			machineInfo.innerHTML = <strong>${process.machine}</strong> - ${process.tankNo} (<em>${process.route}</em>);

			const totalClock = document.createElement("div");
			totalClock.innerText = Total Time: ${formatTime(process.totalTime)};

			const completedTime = document.createElement("div");
			completedTime.innerText = Completed at: ${process.developedTime};

			processDiv.appendChild(machineInfo);
			processDiv.appendChild(totalClock);
			processDiv.appendChild(completedTime);

			developedListContainer.appendChild(processDiv);
		});
	};

	const formatTime = (timeInSeconds) => {
		const hours = Math.floor(timeInSeconds / 3600)
			.toString()
			.padStart(2, "0");
		const minutes = Math.floor((timeInSeconds % 3600) / 60)
			.toString()
			.padStart(2, "0");
		const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
		return ${hours}:${minutes}:${seconds};
	};

	addProcessBtn.addEventListener("click", addProcessEntry);
});