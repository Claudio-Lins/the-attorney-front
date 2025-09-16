import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Enum para Role conforme Prisma
export type Role = "ADMIN" | "USER";

export interface UserData {
	id: string | null;
	clientId: string | null;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	password: string | null;
	passportNumber: string | null;
	passportExpiry: string | null; // DateTime como string
	nationality: string | null;
	placeOfBirth: string | null;
	dateOfBirth: string | null; // DateTime como string
	gender: string | null;
	filiation: any | null; // Json
	createdAt: string | null;
	updatedAt: string | null;
	phone: string | null;
	role: Role | null;
	photoUrl: string | null;
}

interface UserState extends UserData {
	setRole: (role: Role) => void;
	clearRole: () => void;
	setUserData: (data: Partial<UserData>) => void;
	clearUserData: () => void;
	setRegistered: (registered: boolean) => void;
	clearRegistered: () => void;
	handleLogout: () => void;
	registered: boolean;
}

const initialState: UserData & { registered: boolean } = {
	id: null,
	clientId: null,
	firstName: null,
	lastName: null,
	email: null,
	password: null,
	passportNumber: null,
	passportExpiry: null,
	nationality: null,
	placeOfBirth: null,
	dateOfBirth: null,
	gender: null,
	filiation: null,
	createdAt: null,
	updatedAt: null,
	phone: null,
	role: null,
	photoUrl: null,
	registered: false,
};

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			...initialState,
			setRole: (role) => set({ role }),
			clearRole: () => set({ role: null }),
			setUserData: (data) => set((state) => ({ ...state, ...data })),
			clearUserData: () => set((state) => ({ ...initialState, registered: state.registered })),
			setRegistered: (registered) => set({ registered }),
			clearRegistered: () => set({ registered: false }),
			handleLogout: () => set((state) => ({ ...initialState, registered: state.registered })),
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

/* eslint-disable prefer-arrow/prefer-arrow-functions */
