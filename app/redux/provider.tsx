"use client";

import { Provider } from "react-redux";
import { store } from "./store";

// client component for wrapping other components with redux store
export function Providers({ children }: { children: React.ReactNode }) {
	return <Provider store={store}>{children}</Provider>;
}
