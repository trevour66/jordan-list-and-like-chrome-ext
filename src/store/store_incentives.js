import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useIncentivesStore = defineStore("incentives_employees", () => {
	const employees = ref([]);
	const incentives = ref([]);
	const positions = ref([]);
	const isEmployeeAnAttorney = ref(null);

	const getIncentives = computed(() => incentives.value);
	const getEmployees = computed(() => employees.value);
	const getPositions = computed(() => positions.value);
	const get_isEmployeeAnAttorney = computed(() => isEmployeeAnAttorney.value);

	function setIncentives(incentivesArr) {
		incentives.value = incentivesArr;
	}

	function setEmployees(employeesArr) {
		employees.value = employeesArr;
	}

	function setPositions(positionsArr) {
		positions.value = positionsArr;
	}

	function set_isEmployeeAnAttorney(isAnAttorney) {
		isEmployeeAnAttorney.value = isAnAttorney;
	}

	return {
		getEmployees,
		getIncentives,
		getPositions,
		get_isEmployeeAnAttorney,

		setEmployees,
		setIncentives,
		setPositions,
		set_isEmployeeAnAttorney,
	};
});
