export interface AuthPageTypes {
	id: number;
	documentId: string;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
	locale: string;
	logo: LogoTypes;
	signIn: SignInTypes;
	signUp: SignUpTypes;
	emailVerification: EmailVerificationTypes;
	userSetting: UserSettingTypes;
	emailVerificationTemplate: EmailVerificationTemplateTypes;
	resetPassword: ResetPasswordTypes;
	actionResetPasswordAndChangePassword: ActionResetPasswordAndChangePasswordTypes;
	changePassword: ChangePasswordTypes;
	meta: MetaTypes;
}

export interface ActionResetPasswordAndChangePasswordTypes {
	id: number;
	errorValidatedEmail: string;
	errorExistingUser: string;
	successResetPasswordToken: string;
	errorSendResetPasswordEmail: string;
	clickBodyEmail: string;
	contentBodyEmail: string;
	successResetPasswordEmail: string;
	errorChangePasswordToken: string;
	errorChangePasswordValidatedPassword: string;
	errorChangePasswordExistingToken: string;
	errorChangePasswordHasExpired: string;
	errorChangePasswordExistingUser: string;
	successChangePassword: string;
}

export interface ChangePasswordTypes {
	id: number;
	errorChangePasswordOnSubmit: string;
	titleChangePassword: string;
	descriptionChangePassword: string;
	labelChangePasswordNewPassword: string;
	placeholderChangePasswordNewPassword: string;
	errorChangePasswordNewPassword: string;
	successChangePasswordNewPassword: string;
	submitChangePassword: string;
	linkChangePasswordConnectNow: string;
}

export interface EmailVerificationTypes {
	id: number;
	tokeError: string;
	verifyTokenError: string;
	title: string;
	error: string;
	backToLogin: string;
}

export interface EmailVerificationTemplateTypes {
	id: number;
	title: string;
	contentEmailTemplate: string;
	linkEmailTemplate: string;
}

export interface LogoTypes {
	id: number;
	documentId: string;
	url: string;
	alternativeText: null;
	width: number;
	height: number;
}

export interface MetaTypes {}

export interface ResetPasswordTypes {
	id: number;
	errorResetPassword: string;
	titleResetPassword: string;
	descriptionResetPassword: string;
	labelResetPasswordEmail: string;
	successResetPassword: string;
	connectResetPasswordText: string;
	placeholderResetPasswordEmail: string;
	submitResetPassword: string;
	labelResetPasswordNewPassword: string;
	descriptionResetPasswordNewPassword: string;
}

export interface SignInTypes {
	id: number;
	labelEmail: string;
	placeholderEmail: string;
	labelPassword: string;
	placeholderPassword: string;
	forgotPassword: string;
	buttonSubmit: string;
	dontHaveAccount: string;
	title: string;
	subtitle: string;
	somethingWentWrong: string;
	codeTitle: string;
	codeMessage: string;
	loginError: string;
	buttonCode: string;
}

export interface SignUpTypes {
	id: number;
	labelClientID: string;
	placeholderClientID: string;
	labelName: string;
	placeholderName: string;
	labelEmail: string;
	placeholderEmail: string;
	labelPassword: string;
	placeholderPassword: string;
	buttonSubmit: string;
	termsAndConditions: string;
	alredyHaveAccount: string;
	title: string;
	subtitle: string;
	registerError: string;
}

export interface UserSettingTypes {
	id: number;
	serverError: string;
	userSettingError: string;
	titleUserSetting: string;
	descriptionUserSetting: string;
	labelUserSettingName: string;
	placeholderUserSettingName: string;
	labelUserSettingEmail: string;
	placeholderUserSettingEmail: string;
	labelUserSettingPassword: string;
	placeholderUserSettingPassword: string;
	labelUserSettingNewPassword: string;
	placeholderUserSettingNewPassword: string;
	titleTwoFactor: string;
	subtitleTwoFactor: string;
	errorTwoFactor: string;
	successTwoFactor: string;
	submitTwoFactorButton: string;
	backToHomeTwoFactor: string;
}
