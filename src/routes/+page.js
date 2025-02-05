import { redirect } from "@sveltejs/kit";
import { defaultAppSettings } from "../stores/languageStore";

export async function load({ route }) {
    let defaultLanguage = "";
    let defaultStore = "";
    const unsubscribe = defaultAppSettings.subscribe((defaultSettings) => {
        defaultLanguage = defaultSettings?.defaultLanguage;
        defaultStore = defaultSettings?.defaultStore;
    });
    if (route.id === "/") {
        redirect(307, `/${defaultLanguage}-${defaultStore}/`);
    }
}
