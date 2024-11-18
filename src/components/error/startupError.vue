<template>
	<div
		class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
	>
		<div>
			<h5
				class="mb-2 text-2xl font-bold tracking-tight text-red-800 dark:text-white"
			>
				Error !!!
			</h5>
		</div>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
			{{ message }}
		</p>
	</div>
</template>

<script setup>
defineProps({
	message: {
		default:
			"We experienced an error while starting up your application. Please contact support",
		type: String,
	},
});
</script>

<style></style>
