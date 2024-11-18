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
			// button.innerText = 'Add to my List & Like';
			button.className = "scrape-button";
			button.style.marginLeft = "10px";
			button.style.marginRight = "10px";
			button.style.color = "#f24b54"; // Set the text color
			button.style.borderColor = "#f24b54"; // Set the border color
			button.style.borderStyle = "solid";
			button.style.borderWidth = "1px";
			button.style.padding = "6px";
			button.style.borderRadius = "10%"; // Fully rounded border
			button.style.cursor = "pointer"; // Enable cursor pointer on hover
			button.style.position = "relative"; // Set position to relative
			button.style.zIndex = "50"; // Set z-index
			button.style.display = "inline-flex";

			// Add focus styles
			button.onfocus = () => {
				button.style.outline = "2px solid #f24b54"; // Optional: Add focus outline
				button.style.backgroundColor = "#ffe6e7"; // Change background on focus
			};
			button.onblur = () => {
				button.style.outline = "none"; // Remove focus outline
				button.style.backgroundColor = ""; // Revert background
			};

			// Add the SVG to the button
			button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="#f24b54">
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

	const profileData = { username: extractedValue };

	chrome.runtime.sendMessage(
		{
			action: "scrapeProfile",
			data: profileData,
		},
		async (response) => {
			console.log("Profile data sent to backend:", await response);
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
