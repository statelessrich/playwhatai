"use client";

import { store } from "./store";
import { Provider } from "react-redux";

// client component for wrapping other components with redux store
export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
