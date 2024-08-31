import { LOGIN, LOGOUT, UPDATE_USER } from "../actions/UserAction";
import { initialUser } from "../contexts/UserContext";

export const userReducer = (state, action) => {
	switch (action.type) {
		case LOGIN:
			return action.payload;
		case LOGOUT:
			return initialUser;
		case UPDATE_USER:
			return {
				...state,
				data: {
					...state.data,
               ...action.payload.data,
				},
				profile: {
               ...state.profile,
               ...action.payload.profile,
            },
			};
		default:
			return state;
	}
};
