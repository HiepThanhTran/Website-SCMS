import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import cookie from "react-cookies";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { MyUserContext } from "../../App";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import Swal from "sweetalert2";
import "./Login.css";

const Login = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [q] = useSearchParams();
    const nav = useNavigate();
    
    useEffect(() => {
        if (cookie.load("token") && user !== null) {
            nav("/");
        }
    }, [nav, user]);

    const login = async (e) => {
        e.preventDefault();

        try {
            let res = await APIs.post(endpoints.login, {
                username: username,
                password: password,
            });
            cookie.save("token", res.data);

            let currentUser = await authApi().get(endpoints.profile);
            cookie.save("user", currentUser.data);

            dispatch({
                type: "login",
                payload: currentUser.data,
            });

            Swal.fire({
                title: "Đăng nhập thành công",
                text: "Chúc mừng bạn đã đăng nhập thành công.",
                icon: "success",
                confirmButtonText: "Đóng",
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            }).then(() => {
                let next = q.get("next") || "/";
                nav(next);
            });

        } catch (err) {
            const errorResponse = err.response?.data;
            const errorMessage = errorResponse && Array.isArray(errorResponse) && errorResponse.length > 0
                ? errorResponse[0].message
                : "Có lỗi xảy ra, vui lòng thử lại.";

            Swal.fire({
                title: "Đăng nhập thất bại",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Đóng",
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            });
        }
    };

    if (user !== null) {
        let next = q.get("next") || "/";
        return <Navigate to={next} />;
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="text-center mb-3 login-title">Đăng nhập</h2>
                <Form onSubmit={login} className="login-form">
                    <Form.Group className="mb-3">
                        <Form.Control
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="Tên đăng nhập"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 position-relative">
                        <Form.Control
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            required
                        />
                        <Button
                            variant="link"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            style={{
                                backgroundColor: "var(--primary-color)",
                                borderColor: "var(--primary-color)",
                                fontWeight: "500",
                            }}>
                            Đăng nhập
                        </Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
};

export default Login;