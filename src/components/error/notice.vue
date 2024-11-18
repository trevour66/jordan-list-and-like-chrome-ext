<template>
	<div
		class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
	>
		<div>
			<h5
				class="mb-2 text-2xl font-bold tracking-tight text-amber-800 dark:text-white"
			>
				Notice !!!
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
		reqiured: true,
		type: String,
	},
});
</script>

<style></style>
