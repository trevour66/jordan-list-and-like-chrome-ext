<script setup>
defineProps({
	fill: {
		type: String,
		default: "#a0785a",
	},
	w_class: {
		type: String,
		default: "w-[20px]",
	},
	h_class: {
		type: String,
		default: "h-[20px]",
	},
});
</script>

<template>
	<svg
		:class="[w_class, h_class]"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g id="SVGRepo_bgCarrier" stroke-width="0" />

		<g
			id="SVGRepo_tracerCarrier"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>

		<g id="SVGRepo_iconCarrier">
			<path
				d="M6 12L18 12"
				stroke="#000000"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</g>
	</svg>
</template>
