import { getAuth, ROOT_BACKEND_URL } from "../config/config";
const axios = require("axios").default;

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const addIGProfile = async (username) => {
	const auth = await getAuth();
	const currentUrl = `${ROOT_BACKEND_URL}/api/add-ig-profile`;

	const IG_usernameObj = await chrome.storage.local.get("IG_username");
	const IG_username = IG_usernameObj?.IG_username ?? false;

	// status: "logged_in";
	// token: "2|LCwBfOZLUhn4l8ortqxmsLNfDNWtfUgrX9Z1Bx7r639651c5";
	// token_created_at: "2024-07-22T08:14:46.000000Z";

	console.log(IG_username);

	const status = auth?.status ?? false;
	const token = auth?.token ?? false;
	const token_created_at = auth?.token_created_at ?? false;

	if (status != "logged_in" || !token || !token_created_at || !username) {
		return;
	}

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
		.then(async (res) => {
			if (res.status == 200) {
				console.log(res.data);
				// return res.data;
				const responseStatus = res.data?.status ?? "";
				const status = responseStatus === "success" ? "sent" : "failed";

				await new Promise((resolve, reject) => {
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
							resolve;
						});
					});
				});
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
		});

	// const response = await axios
	// 	.get(`${currentUrl}`, {
	// 		headers: {
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	})
	// 	.then((res) => {
	// 		if (res.status == 200) {
	// 			return res.data.data;
	// 		}
	// 	})
	// 	.catch((errRes) => {
	// 		console.log(errRes);
	// 		mainStore.setReauthorizeActionStepError(
	// 			`There was an error while processing your request, please try again. If problem persists contact support.`
	// 		);
	// 		return false;
	// 	});

	// return response;
};

export { addIGProfile };
