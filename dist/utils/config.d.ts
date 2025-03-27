declare global {
    interface Window {
        _env_?: {
            VITE_POSTHOG_KEY?: string;
        };
    }
}
export declare const config: {
    readonly posthogKey: string;
    readonly posthogApiHost: "https://us.i.posthog.com";
    readonly posthogUiHost: "https://us.posthog.com";
};
