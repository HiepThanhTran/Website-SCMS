import { LOGIN, LOGOUT, UPDATE_USER } from "../actions/UserAction";

export const userReducer = (state, action) => {
	switch (action.type) {
		case LOGIN:
			return action.payload;
		case LOGOUT:
			return null;
		case UPDATE_USER:
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};
