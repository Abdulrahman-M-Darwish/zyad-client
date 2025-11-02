import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
	user: null as User | null,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User | null>) => {
			state.user = action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;
