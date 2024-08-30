import "./Profile.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { authApi, endpoints } from "../../configs/APIs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import Loading from "../../layout/loading/Loading";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../../App";
import { useContext } from "react";

const Profile = () => {
    const navigate = useNavigate();
    const [user, dispatch] = useContext(MyUserContext);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadProfile = async () => {
        try {
            let res = await authApi().get(endpoints.profile);
            setEmail(res.data.email);
            setUsername(res.data.username);
            setAvatar(res.data.avatar);
            setRole(res.data.role);
            const isConfirmed = res.data.isConfirm;
            setConfirm(isConfirmed === false ? "Chưa xác thực" : "Đã xác thực");
            setIsConfirmed(isConfirmed);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const formData = new FormData();
    
            if (email) {
                formData.append("email", email);
            }
            if (username) {
                formData.append("username", username);
            }
            if (role) {
                formData.append("role", role);
            }
            formData.append("confirm", confirm);
    
            if (password !== "" || confirmPassword !== "") {
                if (password.length < 8) {
                    Swal.fire({
                        title: "Lỗi",
                        text: "Mật khẩu phải có ít nhất 8 ký tự!",
                        icon: "error",
                        confirmButtonText: "Đóng",
                        customClass: {
                            confirmButton: 'swal2-confirm'
                        }
                    });
                    return;
                }
    
                if (password !== confirmPassword) {
                    Swal.fire({
                        title: "Lỗi",
                        text: "Mật khẩu và xác nhận mật khẩu không khớp!",
                        icon: "error",
                        confirmButtonText: "Đóng",
                        customClass: {
                            confirmButton: 'swal2-confirm'
                        }
                    });
                    return;
                }
                formData.append("password", password);
            }
    
            // Xử lý avatar: chỉ thêm nếu có thay đổi
            if (avatar instanceof File) {
                formData.append("avatar", avatar);
            }
    
            const res = await authApi().post(endpoints.updateProfile, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (res.status === 200) {
                Swal.fire({
                    title: "Cập nhật thành công!",
                    text: "Thông tin hồ sơ của bạn đã được cập nhật.",
                    icon: "success",
                    confirmButtonText: "Đóng",
                    customClass: {
                        confirmButton: 'swal2-confirm'
                    }
                }).then(() => {
                    dispatch({ type: "update", payload: res.data });
                    navigate('/');
                });
            }
        } catch (err) {
            const errorResponse = err.response?.data;
            const errorMessage = errorResponse && Array.isArray(errorResponse) && errorResponse.length > 0
                ? errorResponse[0].message
                : "Có lỗi xảy ra, vui lòng thử lại.";
            
            Swal.fire({
                title: "Cập nhật thất bại",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Đóng",
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            });
        }
    };
    
    
    
    const handleConfirmAccount = async () => {
        if (password !== confirmPassword) {
            Swal.fire({
                title: "Lỗi",
                text: "Mật khẩu và xác nhận mật khẩu không khớp!",
                icon: "error",
                confirmButtonText: "Đóng",
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            });
            return;
        }

        try {
            setLoading(true);
            const res = await authApi().post(endpoints.confirm);
            if (res.status === 200) {
                Swal.fire({
                    title: "Xác thực thành công",
                    text: "Tài khoản của bạn đã được xác thực.",
                    icon: "success",
                    confirmButtonText: "Đóng",
                    customClass: {
                        confirmButton: 'swal2-confirm'
                    }
                });
                setConfirm("Đã xác thực");
                setIsConfirmed(true);
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Xác thực thất bại",
                text: "Đã xảy ra lỗi khi xác thực tài khoản.",
                icon: "error",
                confirmButtonText: "Đóng",
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="profile-container">
            {loading ? (
                <Loading />
            ) : (
                <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
                    <Row>
                        <Col sm={3}>
                            <div className="d-flex flex-column align-items-center justify-content-center">
                                <img
                                    className="rounded-circle shadow"
                                    style={{
                                        width: 190,
                                        height: 190,
                                        objectFit: "cover",
                                    }}
                                    src={
                                        avatar instanceof File
                                            ? URL.createObjectURL(avatar)
                                            : avatar
                                                ? avatar
                                                : "https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service.png"
                                    }
                                    alt="Avatar người dùng"
                                />
                                <label
                                    htmlFor="avatar"
                                    type="button"
                                    className="btn btn-secondary mt-3"
                                >
                                    Chọn ảnh
                                </label>
                                <Form.Control
                                    id="avatar"
                                    type="file"
                                    style={{ display: "none" }}
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                        </Col>

                        <Col sm={9}>
                            <div className="profile-content">
                                <h3 className="text-white p-3 product-content__title">Thông tin chung</h3>
                            </div>

                            {!isConfirmed && (
                                <Button
                                    className="mb-3"
                                    variant="success"
                                    onClick={handleConfirmAccount}
                                    style={{
                                        backgroundColor: 'var(--primary-color)',
                                        border: 'none',
                                        color: 'white',
                                        fontWeight: 500
                                    }}
                                >
                                    Xác nhận tài khoản
                                </Button>
                            )}

                            <div className="profile-input">
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Row className="position-relative">
                                    <Col md={6}>
                                        <Form.Group className="mb-3 position-relative">
                                            <Form.Label>Mật khẩu mới</Form.Label>
                                            <Form.Control
                                                value={password}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Mật khẩu"
                                                required
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <Button
                                                variant="link"
                                                className="password-toggle-profile"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash style={{ color: "var(--primary-color)" }} /> : <FaEye style={{ color: "var(--primary-color)" }} />}
                                            </Button>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3 position-relative">
                                            <Form.Label>Xác nhận mật khẩu</Form.Label>
                                            <Form.Control
                                                value={confirmPassword}
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Xác nhận mật khẩu"
                                                required
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                            <Button
                                                variant="link"
                                                className="password-toggle-profile"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash style={{ color: "var(--primary-color)" }} /> : <FaEye style={{ color: "var(--primary-color)" }} />}
                                            </Button>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Vai trò</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Trạng thái xác thực</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={confirm}
                                        readOnly
                                    />
                                </Form.Group>

                                <div className="text-center">
                                    <Button
                                        variant="primary"
                                        onClick={handleUpdateProfile}
                                        style={{
                                            backgroundColor: 'var(--primary-color)',
                                            border: 'none',
                                            color: 'white',
                                            fontWeight: 500
                                        }}
                                    >
                                        Cập nhật
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
        </Container>
    );
};

export default Profile;