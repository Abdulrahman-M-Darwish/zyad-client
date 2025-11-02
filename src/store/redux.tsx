/* eslint-disable react-hooks/refs */
"use client";
import { useRef } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "@/store/api";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { userSlice } from "./features/userSlice";

// cookie storage adapter for redux-persist using cookies-next
const cookieStorage = {
	getItem: (key: string) => {
		return new Promise<string | null>((resolve) => {
			try {
				const v = getCookie(key) as string | undefined | null;
				resolve(v == null ? null : String(v));
			} catch (e) {
				resolve(null);
			}
		});
	},
	setItem: (key: string, value: string) => {
		return new Promise<void>((resolve) => {
			try {
				setCookie(key, value, {
					maxAge: 7 * 24 * 60 * 60,
					path: "/",
					sameSite: "lax",
				});
			} catch (e) {
				// no-op
			}
			resolve();
		});
	},
	removeItem: (key: string) => {
		return new Promise<void>((resolve) => {
			try {
				deleteCookie(key, { path: "/" });
			} catch (e) {
				// no-op
			}
			resolve();
		});
	},
};

/* REDUX STORE */
const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	user: userSlice.reducer,
});

const persistedReducer = persistReducer(
	{ key: "root", storage: cookieStorage, blacklist: [api.reducerPath] },
	rootReducer
);

export const makeStore = () => {
	return configureStore({
		reducer: persistedReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				},
			}).concat(api.middleware),
	});
};

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* PROVIDER */
export default function StoreProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const storeRef = useRef<AppStore | null>(null);
	const persistorRef = useRef<Persistor | null>(null);
	if (!storeRef.current || !persistorRef.current) {
		storeRef.current = makeStore();
		persistorRef.current = persistStore(storeRef.current);
		setupListeners(storeRef.current.dispatch);
	}
	return (
		<Provider store={storeRef.current}>
			<PersistGate loading={null} persistor={persistorRef.current}>
				{children}
			</PersistGate>
		</Provider>
	);
}
