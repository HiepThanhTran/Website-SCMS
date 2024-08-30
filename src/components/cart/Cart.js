import { useState } from "react";
import { Alert, Table, Button } from "react-bootstrap";
import cookie from "react-cookies";
import "./Cart.css";

const Cart = () => {
    const [cart, setCart] = useState(cookie.load("cart") || null);

    return (
        <div className="cart-container">
            <h1>Giỏ hàng</h1>

            {cart === null ? <Alert variant="warning">Không có sản phẩm</Alert> : <>
                <Table>
                    <tr>
                        <th>id</th>
                        <th>Tên sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                    </tr>

                    {Object.values(cart).map(c => <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.price}</td>
                        <td>{c.quantity}</td>
                        <td>
                            <Button>
                                x
                            </Button>          
                        </td>
                    </tr>)}
                </Table>
            </>}
        </div>
    );
}

export default Cart;