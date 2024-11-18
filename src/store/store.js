import { defineStore } from "pinia";
import { VIEWS, MODALS } from "../config/config";
import { ref, computed, reactive } from "vue";

export const useMainStore = defineStore("main", () => {
	const view = ref(VIEWS.ACTIONSTEP);
	const loading = ref(true);
	const user_is_logged_in = ref(false);
	const user_logged_in_data = reactive({
		token: "",
		token_created_at: "",
	});
	const currentModal = ref("");
	const currentMattersInView = reactive({
		actions: [],
		nextPage: "",
		prevPage: "",
		participants: [],
		actiontypes: [],
	});
	const reauthorizeActionStepError = ref("");
	const actionStepCriticalError = ref(false);

	const getView = computed(() => view.value);
	const getLoadingVal = computed(() => loading.value);
	const getUserIsLoggedInVal = computed(() => user_is_logged_in.value);
	const getUserLoggedInData = computed(() => user_logged_in_data.value);
	const getCurrentModal = computed(() => currentModal.value);
	const getCurrentMattersInView = computed(() => currentMattersInView);
	const getReauthorizeActionStepError = computed(
		() => reauthorizeActionStepError.value
	);
	const getActionStepCriticalError = computed(
		() => actionStepCriticalError.value
	);

	function setCurrentMatterInView(
		actions = [],
		nextPage = "",
		prevPage = "",
		participants = [],
		actiontypes = []
	) {
		currentMattersInView.actions = actions ?? [];
		currentMattersInView.participants = participants ?? [];
		currentMattersInView.actiontypes = actiontypes ?? [];
		currentMattersInView.nextPage = nextPage ?? "";
		currentMattersInView.prevPage = prevPage ?? "";
	}

	function setView(currentView) {
		view.value = currentView;
	}

	function setActionStepCriticalError(err) {
		actionStepCriticalError.value = err;
	}

	function setReauthorizeActionStepError(err) {
		reauthorizeActionStepError.value = err;
	}

	function setLoadingVal(status) {
		loading.value = status;
	}

	function setUserIsLoggedInVal(status) {
		user_is_logged_in.value = status;
	}

	function setUserLoggedInData(token, token_created_at) {
		user_logged_in_data.token = token;
		user_logged_in_data.token_created_at = token_created_at;
	}

	function displayFilenoteModal() {
		currentModal.value = MODALS.FILENOTE;
	}

	function displayNextStepModal() {
		currentModal.value = MODALS.NEXT_STEP;
	}

	function displaySendGiftModal() {
		currentModal.value = MODALS.SEND_GIFT;
	}

	function displaySendGift_GroupModal() {
		currentModal.value = MODALS.SEND_GROUP_GIFT;
	}

	function closeModal() {
		currentModal.value = "";
	}

	return {
		view,
		getView,
		getLoadingVal,
		getUserIsLoggedInVal,
		getUserLoggedInData,
		getCurrentModal,
		getCurrentMattersInView,
		getReauthorizeActionStepError,
		getActionStepCriticalError,
		setCurrentMatterInView,
		setView,
		setLoadingVal,
		setUserIsLoggedInVal,
		setUserLoggedInData,
		displayFilenoteModal,
		displayNextStepModal,
		displaySendGiftModal,
		displaySendGift_GroupModal,
		closeModal,
		setReauthorizeActionStepError,
		setActionStepCriticalError,
	};
});
