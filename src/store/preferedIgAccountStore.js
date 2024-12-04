import { defineStore } from "pinia";
import { computed, ref, reactive } from "vue";

const usePreferedIgAccountStore = defineStore("preferedIGStore", () => {
	const preferedIgBussinessAccount = reactive({
		IG_username: "",
		IG_account_id: "",
		most_recent_sync: null,
	});

	const get_preferedIgBussinessAccount = computed(() => {
		return preferedIgBussinessAccount;
	});

	const set_preferedIgBussinessAccount = (
		IG_username,
		most_recent_sync,
		IG_account_id
	) => {
		preferedIgBussinessAccount.IG_username = IG_username;
		preferedIgBussinessAccount.IG_account_id = IG_account_id;
		preferedIgBussinessAccount.most_recent_sync = most_recent_sync;
	};

	return {
		preferedIgBussinessAccount,
		get_preferedIgBussinessAccount,
		set_preferedIgBussinessAccount,
	};
});

export default usePreferedIgAccountStore;
