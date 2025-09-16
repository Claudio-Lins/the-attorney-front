export interface BackOfficeUITypes {
	id: number;
	documentId: string;
	locale: string;
	header: HeaderTypes;
	placementValueCard: PlacementValueCardTypes;
	profitCard: ProfitCardTypes;
	rescueCard: RescueCardTypes;
	contractTab: ContractTabTypes;
}

export interface BackOfficeUserTypes {
	clientID: string;
	name: string;
	surname: string;
	shortName?: string;
	personalEmail: string;
	photoUrl: string;
	role?: string;
}

export interface ContractsAndMovimentsTypes {
	clientID: string;
	clientShortName: string;
	photoUrl: string;
	contracts: ContractTypes[];
}

export interface ContractTypes {
	contractID: string;
	dateStart: string;
	dateEnd: string;
	placementValue: string;
	grossProfit: string;
	profitPeriod: string;
	totalPeriod: string;
	totalRescue: string;
	rescueExpected: string;
	nextRescueDate: string;
	nextRescueAmount: string;
	transactions: TransactionTypes[];
}

export interface TransactionTypes {
	transactionId: number;
	description: string | null;
	typeMovementName: string;
	amount: string;
	dueDate: string;
	payDate: null | string;
	color: Color;
	isOpacity: boolean;
	fontWeight: FontWeight;
}

export interface ContractTableTypes {
	transactionId: number;
	description: string | null;
	movementType: string;
	amount: string;
	alert: string;
	dueDate: string | null;
	payDate: string | null;
	font: string;
	isOpacity: boolean;
}

export interface AllContractsAndMovimentsTypes {
	totalInvestedAll: string;
	totalRescueRescueAll: string;
	totalRescueExpectedAll: string;
	clients: ClientContractTypes[];
}

export interface ClientContractTypes {
	clientID: string;
	clientShortName: string;
	photoUrl: string;
	role: string;
	personalEmail: string;
	totalInvestedClient: string;
	totalRescueClient: string;
	totalRescueExpectedClient: string;
	statusClientIcon: string;
	statusClientColor: string;
	statusClientLabel: string;
	contracts: ContractTypes[];
}

export interface ClientInvestmentSummaryTypes {
	clientID: string;
	shortName: string;
	contractPlacementValueSum: string;
	movimentTotalFinancialFunding: string;
	movimentTotalRescueExpected: string;
	movimentTotalRescuePaid: string;
	movimentTotalRescueMissing: string;
}

export interface HeaderTypes {
	id: number;
	clientId: string;
	showValues: string;
	totalInvested: string;
	totalRescue: string;
	totalRescueExpected: string;
	hideValues: string;
}

export interface PlacementValueCardTypes {
	id: number;
	placementValueText: string;
	dateStartText: string;
	dateEndText: string;
}

export interface ProfitCardTypes {
	id: number;
	grossProfitText: string;
	profitPeriodText: string;
	totalPeriodText: string;
	grossProfitIcon: IconTypes;
	profitPeriodIcon: IconTypes;
	totalPeriodIcon: IconTypes;
}

export interface IconTypes {
	id: number;
	documentId: string;
	url: string;
	alternativeText: null;
	width: number;
	height: number;
}

export interface RescueCardTypes {
	id: number;
	totalRescueText: string;
	rescueExpectedText: string;
	nextRescueDateText: string;
}

export interface ContractTabTypes {
	id: number;
	contractId: string;
	contractTableHeadTransactionID: string;
	contractTableHeadDescription: string;
	contractTableHeadMovementType: string;
	contractTableHeadAmount: string;
	contractTableHeadCurrency: string;
	contractTableHeadDueDate: string;
	contractTableHeadPayDate: string;
}

export enum Color {
	Ffff81 = "#ffff81",
	The828282 = "#828282",
	The8Cfca4 = "#8cfca4",
}

export enum FontWeight {
	Bold = "bold",
	Regular = "regular",
}
