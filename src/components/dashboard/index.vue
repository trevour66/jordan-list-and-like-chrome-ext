<script setup>
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { addIGProfile } from "../../services/ig_profiles";
import ActiveIGAccountSelector from "../ActiveIGAccountSelector.vue";

const usernames = ref({});
const ig_data_fetch_process = ref([]);
const working = ref(false);

chrome.storage.local.get("usernames", (result) => {
	usernames.value = result.usernames || {};
});

// Listen for updates from the background script
chrome.runtime.onMessage.addListener((message) => {
	if (message.action === "updateUsernames") {
		usernames.value = message?.usernames ?? {};
	}
});

const retry = async (username) => {
	working.value = true;
	await addIGProfile(username);
	working.value = false;
};

const clearStorage = () => {
	chrome.storage.local.remove("usernames", () => {
		if (chrome.runtime.lastError) {
			console.error("Error removing key:", chrome.runtime.lastError.message);
		} else {
			usernames.value = {};
			// console.log("Key 'usernames' cleared.");
		}
	});
};

onMounted(async () => {
	await new Promise((resolve, reject) => {
		chrome.storage.local.get("auth", (result) => {
			// console.log(result);
			ig_data_fetch_process.value = result?.auth?.ig_data_fetch_process ?? [];

			console.log(ig_data_fetch_process.value);

			resolve;
		});
	});
});
</script>

<template>
	<div class="w-full">
		<div class="float-right">
			<ActiveIGAccountSelector
				:loading-data="false"
				:ig_data_fetch_process="ig_data_fetch_process"
			/>
		</div>
		<div class="clear-both"></div>
	</div>
	<div class="w-full my-4">
		<div>
			<h4 class="text-md font-bold text-gray-700">Added today</h4>
		</div>
	</div>
	<div
		v-if="Object.keys(usernames).length > 0"
		class="h-[70%] border border-gray-200 rounded-md p-2 overflow-y-auto"
	>
		<div class="my-6 float-right">
			<button
				@click="clearStorage"
				class="border border-red-600 px-2 py-1.5 rounded-md"
			>
				clear storage
			</button>
		</div>
		<div class="clear-both"></div>

		<ul
			v-if="Object.keys(usernames).length > 0"
			class="max-w-md space-y-2 list-inside"
		>
			<li
				v-for="username in Object.keys(usernames)"
				:key="username"
				class="flex items-center text-base"
			>
				<svg
					:class="{
						'text-green-500': (usernames[username]?.status ?? '') === 'sent',
						'text-red-500': (usernames[username]?.status ?? '') === 'failed',
					}"
					class="w-5 h-5 me-2 flex-shrink-0"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
					/>
				</svg>
				<span class="text-gray-500">
					{{ username }}
				</span>
				<button
					v-if="(usernames[username]?.status ?? '') === 'failed'"
					:disabled="working"
					@click="retry(username)"
					class="ml-3 border border-gray-500 p-1.5 inline-flex rounded-full"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-3 h-3 flex-shrink-0"
						viewBox="0 0 512 512"
					>
						<path
							d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"
						/>
					</svg>
				</button>
			</li>
		</ul>
	</div>
	<div
		v-else
		class="h-[40%] border border-gray-200 rounded-md p-8 overflow-y-auto flex items-center justify-center"
	>
		<div class="">
			<h4 class="text-md font-bold text-gray-700">
				You have not recored any added user from this device.
			</h4>
		</div>
	</div>
</template>

<style></style>
