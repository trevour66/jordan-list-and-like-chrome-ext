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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "scrapeProfile") {
		(async () => {
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
			const user_list = message?.data?.user_list ?? "";

			console.log(user_list);

			// console.log("received");
			// console.log(message.data);
			// console.log(ROOT_BACKEND_URL);

			if (status != "logged_in" || !token || !token_created_at || !username) {
				chrome.notifications.create(
					`error_processing_username__no_ig_account_found`,
					{
						type: "basic",
						title: `List and Like - Error`,
						iconUrl: "../images/icon48.png",
						message:
							"There was an unexpected error. Please reach out to support at hello@systemssavedme.com ",
						priority: 2,
					}
				);
				sendResponse({ IG_username_error: false, status: "error" });
				return;
			}

			if (!username) {
				chrome.notifications.create(
					`error_processing_username__no_ig_account_found`,
					{
						type: "basic",
						title: `List and Like - Error processing `,
						iconUrl: "../images/icon48.png",
						message: "Instagram username not provided. Please try again",
						priority: 2,
					}
				);
				sendResponse({ IG_username_error: false, status: "error" });
				return;
			}

			console.log(IG_username);

			if (!IG_username) {
				chrome.notifications.create(
					`error_processing_username__no_ig_account_found`,
					{
						type: "basic",
						title: `List and Like - Error processing ${username}: `,
						iconUrl: "../images/icon48.png",
						message:
							"We are not able to fetch any Instagram Business Account. Please go back to your account and add a valid Instagram Business Account. If you are unable to connect your account, reach out to support at hello@systemssavedme.com ",
						priority: 2,
					}
				);

				sendResponse({ IG_username_error: true });
				return;
			}
			// return;

			const currentUrl = `${ROOT_BACKEND_URL}/api/add-ig-profile`;

			axios.defaults.withCredentials = true;
			axios.defaults.withXSRFToken = true;

			chrome.storage.local.get("usernames", (result) => {
				let usernames = result.usernames || {};
				if (!usernames[username]) {
					usernames[username] = {
						status: "loading",
						user_list: user_list,
					};
				} else {
					usernames[username].status = "loading";
				}
				chrome.storage.local.set({ usernames }, () => {
					// Notify the Vue component
					chrome.runtime.sendMessage({
						action: "updateUsernames",
						usernames,
					});
				});
			});

			await axios
				.post(
					`${currentUrl}`,
					{
						ig_handle: username,
						ig_business_account: IG_username,
						user_list: user_list,
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

						sendResponse({ IG_username_error: false, status });
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

					chrome.notifications.create(`error_processing_username`, {
						type: "basic",
						title: `List and Like - Error processing ${username}: `,
						message: `Please try again`,
						priority: 2,
					});

					sendResponse({ IG_username_error: false, status: "error" });
				});
		})();

		return true;
	}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "getList") {
		(async () => {
			try {
				const authObj = await chrome.storage.local.get("auth");
				const IG_usernameObj = await chrome.storage.local.get("IG_username");

				console.log(authObj);
				console.log(IG_usernameObj);

				const userObj = authObj?.auth ?? false;
				const IG_username = IG_usernameObj?.IG_username ?? false;

				const status = userObj?.status ?? false;
				const token = userObj?.token ?? false;
				const token_created_at = userObj?.token_created_at ?? false;

				// console.log("received");
				// console.log(message.data);
				// console.log(ROOT_BACKEND_URL);

				if (status != "logged_in" || !token || !token_created_at) {
					console.log("heresrs");

					return;
				}

				console.log("IG_username");
				console.log(IG_username);
				// return;

				const currentUrl = `${ROOT_BACKEND_URL}/api/my-lists`;

				axios.defaults.withCredentials = true;
				axios.defaults.withXSRFToken = true;

				await axios
					.post(
						`${currentUrl}`,
						{
							IG_username: IG_username,
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
							const list = res?.data?.user_lists ?? [];
							const status = res?.data?.status ?? false;

							sendResponse({
								userObj: userObj,
								IG_username: IG_username,
								status,
								lists: list,
							});
						}
					})
					.catch((err) => {
						console.log(err);
						console.log(err.message);
						const status = res?.data?.status ?? false;

						sendResponse({
							userObj: userObj,
							IG_username: IG_username,
							status,
							lists: [],
						});
					});
			} catch (error) {
				console.error("Error fetching data:", error);
				sendResponse({
					userObj: userObj,
					IG_username: IG_username,
					status: "error",
					lists: [],
				});
			}
		})();
		// Indicate that the response will be sent asynchronously
		return true;
	}
});
