import { ROOT_BACKEND_URL, AUTH_STATE } from "./config/config";
const axios = require("axios").default;

// chrome.storage.onChanged.addListener((changes, namespace) => {
// 	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
// 		console.log(
// 			`Storage key "${key}" in namespace "${namespace}" changed.`,
// 			`Old value was "${oldValue}", new value is "${newValue}".`
// 		);
// 	}
// });

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "openSidePanel",
		title: "Open side panel",
		contexts: ["all"],
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "openSidePanel") {
		// This will open the panel in all the pages on the current window.
		chrome.sidePanel.open({ windowId: tab.windowId });
	}
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	if (message.action === "scrapeProfile") {
		const authObj = await chrome.storage.local.get("auth");
		const IG_usernameObj = await chrome.storage.local.get("IG_username");

		const userObj = authObj?.auth ?? false;
		const IG_username = IG_usernameObj?.IG_username ?? false;

		// status: "logged_in";
		// token: "2|LCwBfOZLUhn4l8ortqxmsLNfDNWtfUgrX9Z1Bx7r639651c5";
		// token_created_at: "2024-07-22T08:14:46.000000Z";

		const status = userObj?.status ?? false;
		const token = userObj?.token ?? false;
		const token_created_at = userObj?.token_created_at ?? false;

		const username = message?.data?.username ?? false;

		// console.log("received");
		// console.log(message.data);
		// console.log(ROOT_BACKEND_URL);

		if (status != "logged_in" || !token || !token_created_at || !username) {
			return;
		}

		console.log(IG_username);
		// return;

		const currentUrl = `${ROOT_BACKEND_URL}/api/add-ig-profile`;

		axios.defaults.withCredentials = true;
		axios.defaults.withXSRFToken = true;

		await axios
			.post(
				`${currentUrl}`,
				{
					ig_handle: username,
					ig_business_account: IG_username,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((res) => {
				if (res.status == 200) {
					console.log(res.data);
					// return res.data;
					const responseStatus = res.data?.status ?? "";

					const status = responseStatus === "success" ? "sent" : "failed";

					// Save to local storage
					chrome.storage.local.get("usernames", (result) => {
						let usernames = result.usernames || {};
						if (!usernames[username]) {
							usernames[username] = { status };
						} else {
							usernames[username].status = status;
						}
						chrome.storage.local.set({ usernames }, () => {
							// Notify the Vue component
							chrome.runtime.sendMessage({
								action: "updateUsernames",
								usernames,
							});
						});
					});

					sendResponse({ status });
				}
			})
			.catch((err) => {
				console.log(err);
				console.log(err.message);
				const status = "failed";

				// Save to local storage
				chrome.storage.local.get("usernames", (result) => {
					let usernames = result.usernames || {};
					if (!usernames[username]) {
						usernames[username] = { status };
					} else {
						usernames[username].status = status;
					}
					chrome.storage.local.set({ usernames }, () => {
						// Notify the Vue component
						chrome.runtime.sendMessage({
							action: "updateUsernames",
							usernames,
						});
					});
				});

				sendResponse({ status: "error" });
			});

		return true;
	}
});
