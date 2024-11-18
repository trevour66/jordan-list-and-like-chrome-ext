import { createApp } from "vue";
import { createPinia } from "pinia";
import "./css/app.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount("#app");

chrome.storage.local.onChanged.addListener((changes) => {
	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		if (key == "auth") {
			app.unmount();

			const pinia = createPinia();
			const new_app = createApp(App);

			new_app.use(pinia);
			new_app.mount("#app");
		}
	}
});
