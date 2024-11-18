<script setup>
import { ref } from "vue";
import { ROOT_BACKEND_URL, AUTH_STATE } from "../../config/config";

const axios = require("axios").default;

const email = ref("");
const password = ref("");
const error_message = ref("");
const loading = ref(false);

const login = async () => {
	try {
		if (loading.value) {
			return;
		}

		loading.value = true;

		if (!email.value || !password.value) {
			error_message.value = "please fill in all the details";
			return;
		}

		let loginFormData = new FormData();

		loginFormData.append("email", email.value);
		loginFormData.append("password", password.value);

		let response = await axios.post(
			`${ROOT_BACKEND_URL}/api/login`,
			loginFormData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		console.log(response);

		let data = response?.data;

		let status = data?.status ?? false;
		let message = data?.message ?? false;
		let token = data?.token ?? false;

		if (!status) {
			throw new Error("Could not pass response data: status");
		}

		if (status == "success" && !token) {
			throw new Error("Could not pass response data: token");
		}

		if (status == "error") {
			throw new Error(
				message ??
					"sorry, we are unable to log you in. If this persist, please contact support"
			);
		}

		let accessToken = token?.accessToken ?? false;
		let plainTextToken = token?.plainTextToken ?? false;
		let created_at = accessToken?.created_at ?? false;

		if (!accessToken || !created_at || !plainTextToken) {
			throw new Error("Could not pass response data: Access Token");
		}

		let auth = {
			status: AUTH_STATE.LOGGED_IN,
			token: plainTextToken,
			token_created_at: created_at,
		};

		chrome.storage.local.set({
			auth: auth,
		});
		loading.value = false;
	} catch (error) {
		error_message.value = error.message;
		loading.value = false;
	}
};
</script>

<template>
	<div
		class="flex min-h-full flex-1 flex-col justify-center px-6 py-14 lg:px-8"
	>
		<div class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
			<div class="flex flex-col items-center justify-center">
				<img src="../../images/icon128.png" class="w-[80%]" alt="" />
			</div>
			<h2
				class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
			>
				Sign in to your account
			</h2>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form class="space-y-6" action="#" method="POST">
				<div>
					<label
						for="email"
						class="block text-sm font-medium leading-6 text-gray-900"
						>Email address</label
					>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							v-model="email"
							type="email"
							autocomplete="email"
							required=""
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F2454F] sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<div class="flex items-center justify-between">
						<label
							for="password"
							class="block text-sm font-medium leading-6 text-gray-900"
							>Password</label
						>
					</div>
					<div class="mt-2">
						<input
							id="password"
							name="password"
							v-model="password"
							type="password"
							autocomplete="current-password"
							required=""
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F2454F] sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div v-if="error_message" class="w-full text-red-800 text-center">
					{{ error_message }}
				</div>

				<div>
					<button
						@click.prevent="login"
						:disabled="loading"
						type="submit"
						class="flex w-full justify-center rounded-md bg-[#F2454F] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2454F]"
					>
						<span v-if="loading" class="mx-2">
							<svg
								aria-hidden="true"
								role="status"
								class="inline w-4 h-4 me-3 text-white animate-spin"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="#333333"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentColor"
								/>
							</svg>
						</span>
						Sign in
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<style></style>
