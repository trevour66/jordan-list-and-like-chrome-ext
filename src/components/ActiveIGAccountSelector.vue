<script setup>
import IG_black from "../components/icons/IG_black.vue";
import { onMounted, ref, reactive, computed, watch, onUpdated } from "vue";
import { initDropdowns } from "flowbite";
import { watchEffect } from "vue";

import usePreferedIgAccountStore from "../store/preferedIgAccountStore.js";

const preferedIgAccountStore = usePreferedIgAccountStore();
const preferedIGAccDropdownButton = ref(null);

const props = defineProps({
	ig_data_fetch_process: {
		type: Array,
	},
	loadingData: {
		type: Boolean,
		required: true,
	},
});

const allAccounts = computed(() => {
	const allBussinesAccounts = props?.ig_data_fetch_process ?? [];

	if (allBussinesAccounts.length > 0) {
		return allBussinesAccounts;
	}

	return [];
});

watchEffect(() => {
	const allBussinesAccounts = props?.ig_data_fetch_process ?? [];

	// console.log("allBussinesAccounts watchefff");
	// console.log(allBussinesAccounts);
	// console.log(props?.ig_data_fetch_process);

	if (allBussinesAccounts.length === 0) return null;

	if (allBussinesAccounts.length >= 1) {
		preferedIgAccountStore.set_preferedIgBussinessAccount(
			allBussinesAccounts[0]?.IG_username ?? false,
			allBussinesAccounts[0]?.IG_data_fetch_process ?? null,
			allBussinesAccounts[0]?.IG_account_id ?? false
		);

		if (allBussinesAccounts[0]?.IG_username ?? false) {
			chrome.storage.local.set({
				IG_username: allBussinesAccounts[0]?.IG_username ?? false,
			});
		}
	}

	initDropdowns();
});

const switchAccount = async (acc) => {
	if (props.loadingData) return;
	// console.log(acc);

	const IG_account_id = acc?.IG_account_id ?? false;
	const IG_data_fetch_process = acc?.IG_data_fetch_process ?? [];
	const IG_username = acc?.IG_username ?? false;

	if (!IG_account_id || !IG_username) {
		return;
	}

	if (
		preferedIgAccountStore.get_preferedIgBussinessAccount.IG_username ===
		IG_username
	)
		return;

	preferedIgAccountStore.set_preferedIgBussinessAccount(
		IG_username ?? false,
		IG_data_fetch_process ?? [],
		IG_account_id ?? false
	);

	if (IG_username ?? false) {
		chrome.storage.local.set({
			IG_username: IG_username ?? false,
		});
	}

	preferedIGAccDropdownButton.value.click();
};

onUpdated(() => {
	initDropdowns();
});
</script>

<template>
	<!-- {{ ig_data_fetch_process }} -->
	<div
		v-if="preferedIgAccountStore.get_preferedIgBussinessAccount?.IG_username"
		class="inline-flex flex-col gap-y-2"
	>
		<p class="text-sm font-normal text-gray-500 dark:text-gray-400">
			Active IG Business Account:
		</p>

		<!-- {{ allAccounts }} -->
		<button
			id="preferedIGAccDropdownButton"
			ref="preferedIGAccDropdownButton"
			data-dropdown-toggle="PreferedIGAccDropdown"
			class="flex items-center text-md pe-1 font-medium text-gray-900 rounded-full hover:text-[#f24b54] md:me-0 focus:ring-4 focus:ring-gray-100"
			type="button"
		>
			<IG_black :class="`w-6 h-6 me-2`" />
			{{ preferedIgAccountStore.get_preferedIgBussinessAccount?.IG_username }}
			<svg
				class="w-2.5 h-2.5 ms-3"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 10 6"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m1 1 4 4 4-4"
				/>
			</svg>
		</button>

		<!-- Dropdown menu -->
		<div
			id="PreferedIGAccDropdown"
			class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
		>
			<ul
				class="py-2 text-sm text-gray-700 dark:text-gray-200"
				aria-labelledby="dropdownInformpreferedIGAccDropdownButtonationButton"
			>
				<li v-for="(acc, index) in allAccounts" :key="index">
					<div
						:class="{
							'bg-gray-100 hover:cursor-not-allowed':
								((acc?.IG_username ?? '') !== '' &&
									(preferedIgAccountStore.get_preferedIgBussinessAccount
										.IG_username === acc?.IG_username ??
										'')) ||
								loadingData,
							'hover:cursor-pointer':
								(acc?.IG_username ?? '') !== '' &&
								(preferedIgAccountStore.get_preferedIgBussinessAccount
									.IG_username !== acc?.IG_username ??
									'') &&
								!loadingData,
						}"
						@click="switchAccount(acc)"
						class="block px-4 py-2 hover:bg-gray-100"
					>
						{{ acc.IG_username }}
					</div>
				</li>
			</ul>
		</div>
	</div>
	<div v-else class="inline-flex flex-col gap-y-2">
		<p class="text-sm font-normal text-red-500 dark:text-gray-400">
			We are not able to fetch any Instagram Business Account. Please go back to
			your account and add a valid Instagram Business Account. If you are unable
			to connect your account, reach out to support at hello@systemssavedme.com
		</p>

		<p class="text-sm font-normal text-red-500 dark:text-gray-400">
			Note: you will have to log into the Google Chrome extension after
			connecting your Instagram Business Account.
		</p>
	</div>
</template>
