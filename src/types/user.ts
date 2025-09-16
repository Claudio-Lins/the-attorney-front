export interface Client {
	id: string;
	clientId: string;
	firstName: string;
	lastName: string;
	email: string | null;
	maritalStatus: string | null;
	passportNumber: string | null;
	passportExpiry: Date | null;
	nationality: string | null;
	placeOfBirth: string | null;
	dateOfBirth: Date | null;
	gender: string | null;
	filiation: {
		father: string;
		mother: string;
	} | null;
	createdAt: Date;
	updatedAt: Date;
	phone: string | null;
	role: "ADMIN" | "USER";
	photoUrl: string | null;
}

export interface UserState {
	userData: {
		client: Client;
		// outros dados do usuário se necessário
	} | null;
	setUserData: (data: UserState["userData"]) => void;
}
