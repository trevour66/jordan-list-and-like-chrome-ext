const VIEWS = {
	ACTIONSTEP: "actionStep",
	INCENTIVES: "incentives",
	DASHBOARD: "dashboard",
	PREFERENCES: "preferences",
};

const MODALS = {
	FILENOTE: "filenote",
	NEXT_STEP: "next_step",
	SEND_GIFT: "send_gift",
	SEND_GROUP_GIFT: "send_group__gift",
};

const AUTH_STATE = {
	LOGGED_IN: "logged_in",
	LOGGED_OUT: "logged_out",
	LOADING: "loading",
};

// const ROOT_BACKEND_URL = "http://127.0.0.1:8000";
const ROOT_BACKEND_URL = "https://listandlike.com";

const getAuth = async () => {
	let user_auth = await chrome.storage.local.get("auth");

	if (!user_auth) {
		return false;
	}

	const status = user_auth?.auth?.status ?? false;
	const token = user_auth?.auth?.token ?? false;
	const token_created_at = user_auth?.auth?.token_created_at ?? false;

	if (status === "logged_in" && token && token_created_at) {
		return {
			status,
			token,
			token_created_at,
		};
	}

	return false;
};

export { VIEWS, MODALS, AUTH_STATE, ROOT_BACKEND_URL, getAuth };
