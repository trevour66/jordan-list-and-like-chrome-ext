<script setup>
import { VIEWS } from "./config/config";
import { useMainStore } from "./store/store";

import dashboardContainer from "./components/dashboard/index.vue";
import login from "./components/auth/login.vue";
import loader from "./components/misc/full_loader.vue";
import startupError from "./components/error/startupError.vue";

import { onMounted, ref, watchEffect } from "vue";

const store = useMainStore();
const errorStartingUp = ref(false);
const StartupErrorMessage = ref("");

const currentView = ref("");

watchEffect(() => {
	currentView.value = store.getView;
});

watchEffect(() => {
	if (store.getReauthorizeActionStepError) {
		StartupErrorMessage.value = store.getReauthorizeActionStepError;
	}
});

const changeView = (view) => {
	store.closeModal();
	store.setView(view);
};

const logout = async () => {
	await chrome.storage.local.remove("auth");
};

onMounted(async () => {
	let user_auth = await chrome.storage.local.get("auth");

	// console.log(user_auth);

	if (!user_auth) {
		store.setLoadingVal(false);
		store.setUserIsLoggedInVal(false);

		return;
	}

	const status = user_auth?.auth?.status ?? false;
	const token = user_auth?.auth?.token ?? false;
	const token_created_at = user_auth?.auth?.token_created_at ?? false;

	// console.log(status);
	// console.log(token);

	if (status === "logged_in" && token && token_created_at) {
		store.setUserIsLoggedInVal(true);
		store.setUserLoggedInData(token, token_created_at);

		// Do something like fetch list
	} else if (!status || !token) {
		store.setUserIsLoggedInVal(false);
	}

	store.setLoadingVal(false);
});
</script>

<template>
	<section class="app-container block bg-white relative h-full">
		<template v-if="errorStartingUp || store.getActionStepCriticalError">
			<div class="h-full w-full">
				<div
					class="absolute top-0 p-3 left-0 w-full h-full flex items-center justify-center z-[20]"
				>
					<startupError :message="StartupErrorMessage" />
				</div>
			</div>
		</template>

		<template v-else-if="store.getLoadingVal">
			<div class="h-full w-full">
				<loader class="absolute top-0 left-0 w-full h-full z-[10]" />
			</div>
		</template>

		<template v-else>
			<template v-if="!store.getUserIsLoggedInVal">
				<div class="h-full"><login /></div>
			</template>
			<template v-else>
				<div class="flex flex-col h-[90vh] w-full my-6">
					<div
						class="dashboard-wrapper min-h-full relative w-full h-full py-3 px-2"
					>
						<dashboardContainer />
					</div>
				</div>

				<div
					class="fixed bottom-0 z-[10] flex w-full min-h-[8vh] h-[8vh] text-sm font-medium text-center text-white"
				>
					<div
						@click="changeView(VIEWS.DASHBOARD)"
						:class="{
							'bg-slate-700': currentView == VIEWS.DASHBOARD,
						}"
						class="nav basis-1/2 h-full flex items-center justify-center hover:bg-slate-600 hover:cursor-pointer bg-slate-400"
					>
						Dashboard
					</div>
					<div
						@click="logout"
						class="nav basis-1/2 h-full flex items-center justify-center hover:bg-slate-600 hover:cursor-pointer bg-red-400 rounded-br-lg"
					>
						Sign out
					</div>
				</div>
			</template>
		</template>
	</section>
</template>

<style scoped>
.app-container {
	width: 100%;
	height: 100%;
	min-height: 100vh;
}
.app-container .nav {
	transition: all 200ms ease-in-out;
}
</style>
