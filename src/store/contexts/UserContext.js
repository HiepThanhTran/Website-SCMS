import { createContext, useContext, useReducer } from "react";
import { userReducer } from "../reducers/UserReducer";

export const UserContext = createContext(null);
export const UserDispatchContext = createContext(null);

const initialUser = {};

export const UserProvider = ({ children }) => {
	const [user, dispatch] = useReducer(userReducer, initialUser);

	return (
		<UserContext.Provider value={user}>
			<UserDispatchContext.Provider value={dispatch}>
				{children}
			</UserDispatchContext.Provider>
		</UserContext.Provider>
	);
};

export const useUser = () => {
	return useContext(UserContext);
};

export const useUserDispatch = () => {
	return useContext(UserDispatchContext);
};
