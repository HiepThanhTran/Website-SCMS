import cookie from "react-cookies";

const MyCartReducer = (currentState, action) => {
    if(action.type === "update"){
        let cart = cookie.load("cart") || null;
        if(cart !== null) {
            let totalQuantity = 0;
            for(let c of Object.values(cart)){
                totalQuantity += c.quantity;
            }

            return totalQuantity;
        }
    }
    return currentState;
}

export default MyCartReducer;