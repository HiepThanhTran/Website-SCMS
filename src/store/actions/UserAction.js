import cookie from "react-cookies";

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
const UPDATE_USER = "UPDATE_ACCOUNT";

export { LOGIN, LOGOUT, UPDATE_USER };

const LoginAction = (payload) => {
	return {
		type: LOGIN,
		payload: payload,
	};
};

const LogoutAction = () => {
	cookie.remove("token");
	cookie.remove("user");
	return {
		type: LOGOUT,
	};
};

const UpdateUserAction = (payload) => {
	cookie.save("user", payload);
	return {
		type: UPDATE_USER,
		payload: payload,
	};
};

export { LoginAction, LogoutAction, UpdateUserAction };
