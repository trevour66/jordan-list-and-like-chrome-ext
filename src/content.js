window.LIST_AND_LIKE_selectedListValue = "";

createListDropdown();

function get_LIST_AND_LIKE_selectedListValue() {
	let user_list = window?.LIST_AND_LIKE_selectedListValue ?? "";

	if (user_list !== "") {
		return user_list;
	}

	const getDropdownIfExist =
		document.getElementById("list_and_like___list_dropdown") ?? null;

	if (getDropdownIfExist === null) {
		return "";
	}

	if (getDropdownIfExist) {
		const selectedValue = getDropdownIfExist?.value ?? "";
		console.log("Selected value:", selectedValue);

		return selectedValue;
	}

	return "";
}

async function createListDropdown() {
	const userList = await new Promise(async (resolve, reject) => {
		chrome.runtime.sendMessage(
			{
				action: "getList",
				data: {},
			},
			async (response) => {
				const res_Data = await response;
				// console.log("Profile data sent to backend:", res_Data);
				resolve(res_Data);
			}
		);
	});

	// console.log(userList);

	const userObj = userList?.userObj ?? null;
	const IG_username = userList?.IG_username ?? "";
	const status = userList?.status ?? null;
	const lists = userList?.lists ?? [];

	const getDropdownIfExist =
		document.getElementById("list_and_like___list_dropdown") ?? null;

	if (!getDropdownIfExist) {
		// Create the dropdown element
		const dropdown = document.createElement("select");
		dropdown.id = "list_and_like___list_dropdown"; // As

		// Add some options to the dropdown
		const options = [{ list_name: "Select List" }, ...lists];
		options.forEach((optionText) => {
			const option = document.createElement("option");
			option.value =
				optionText?.list_name == "Select List" ? "" : optionText?.list_name;
			option.textContent = optionText?.list_name.toUpperCase();
			dropdown.appendChild(option);
		});

		Object.assign(dropdown.style, {
			marginLeft: "5px", // Add left margin
			marginRight: "5px", // Add right margin
			color: "#fff", // Set text color to white
			borderColor: "#f24b54", // Set border color
			borderStyle: "solid", // Use solid border
			borderWidth: "1px", // Set border width
			padding: "8px", // Set inner padding
			borderRadius: "4px", // Rounded border
			cursor: "pointer", // Enable pointer cursor
			position: "fixed", // Fix to a specific position on the screen
			zIndex: "5000", // Ensure it appears above most elements
			display: "inline-flex", // Align items horizontally
			alignItems: "center", // Center align items vertically
			justifyContent: "center", // Center align items horizontally
			backgroundColor: "#f24b54", // Set background color
			top: "50%", // Vertically center
			right: "20px", // Stick 20px from the right edge
			transform: "translateY(-50%)", // Adjust for proper vertical centering
			fontSize: "16px", // Bigger text
			fontWeight: "bold", // Make text bold
			minWidth: "150px",
		});

		// Add selected style
		dropdown.addEventListener("change", () => {
			dropdown.style.backgroundColor = "#ffcccb"; // Change background when an option is selected
			dropdown.style.color = "#000"; // Change text color for contrast
		});

		// Add an event listener to store the selected value
		dropdown.addEventListener("change", () => {
			// console.log("change");
			// console.log(dropdown.value);
			window.LIST_AND_LIKE_selectedListValue = dropdown.value; // Save the selected value globally
			// console.log("Selected value:", window.LIST_AND_LIKE_selectedListValue);
		});

		// Append the dropdown to the body
		document.body.appendChild(dropdown);
	}
}

function addButtonToProfiles() {
	const articleTags = document.querySelectorAll("article") ?? [];

	articleTags.forEach((article) => {
		const anchorTags = article.querySelectorAll(
			"div > div > div > div:nth-child(2) div div div div a:nth-child(1)"
		);

		// console.log('here')
		// console.log(anchorTags)

		let neededAnchor = anchorTags[0];

		if (!(neededAnchor ?? false)) {
			return;
		}

		if (!neededAnchor.parentElement.querySelector(".scrape-button")) {
			const button = document.createElement("button");
			button.className = "scrape-button";
			button.style.marginLeft = "10px";
			button.style.marginRight = "10px";
			button.style.color = "#fff"; // Set the text color
			button.style.borderColor = "#f24b54"; // Set the border color
			button.style.borderStyle = "solid";
			button.style.borderWidth = "1px";
			button.style.padding = "8px";
			button.style.borderRadius = "10%"; // Fully rounded border
			button.style.cursor = "pointer"; // Enable cursor pointer on hover
			button.style.position = "relative"; // Set position to relative
			button.style.zIndex = "5000"; // Set z-index
			button.style.display = "inline-flex";
			button.style.backgroundColor = "#f24b54"; // Revert background

			// Add focus styles
			button.onfocus = () => {
				button.style.outline = "2px solid #f24b54"; // Optional: Add focus outline
				button.style.backgroundColor = "#ffe6e7"; // Change background on focus
			};
			button.onblur = () => {
				button.style.outline = "none"; // Remove focus outline
				button.style.backgroundColor = "#f24b54"; // Revert background
			};

			// Add the SVG to the button
			button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="#fff">
          <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
        </svg>
        `;

			button.onclick = () => scrapeProfile(neededAnchor.getAttribute("href"));

			neededAnchor.parentElement.appendChild(button);
		}
	});
}

// Function to handle button click and send profile data to the backend
function scrapeProfile(profileUrl) {
	console.log(profileUrl);

	const match = profileUrl.match(/^\/[^/]+/);

	if (!match) return;

	if (!match[0]) return;

	let extractedValue = match[0];

	extractedValue = String(extractedValue).replace("/", "");

	if (!extractedValue) return;

	console.log(extractedValue);

	const user_list = get_LIST_AND_LIKE_selectedListValue();

	console.log("user_list");
	console.log(user_list);

	const profileData = { username: extractedValue, user_list: user_list };

	window.alert(`Processing ${extractedValue}`);

	chrome.runtime.sendMessage(
		{
			action: "scrapeProfile",
			data: profileData,
		},
		async (response) => {
			const result = await response;
			console.log("Profile data sent to backend:", result);

			if (result.IG_username_error ?? false) {
				// window.alert(
				// 	`Error processing ${username}: We are not able to fetch any Instagram Business Account.
				// 	Please go back to your account and add a valid Instagram Business Account. If you are
				// 	unable to connect your account, reach out to support at hello@systemssavedme.com
				// 	`
				// );
				chrome.notifications.create(
					`error_processing_username__no_ig_account_found`,
					{
						type: "basic",
						title: `Error processing ${username}: `,
						message:
							"We are not able to fetch any Instagram Business Account. Please go back to your account and add a valid Instagram Business Account. If you are unable to connect your account, reach out to support at hello@systemssavedme.com ",
						priority: 2,
					}
				);
			} else {
				// window.alert(`Error processing ${username}: Please try again`);
				chrome.notifications.create(`error_processing_username`, {
					type: "basic",
					title: `Error processing ${username}: `,
					message: `Please try again`,
					priority: 2,
				});
			}
		}
	);
}

// Function to observe DOM changes and add buttons dynamically
function observeDOMChanges() {
	const observer = new MutationObserver(addButtonToProfiles);

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
}

// Run the initial function to add buttons
addButtonToProfiles();

// Start observing DOM changes
observeDOMChanges();
