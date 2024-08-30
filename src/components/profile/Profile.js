import "./Profile.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../../App";
import { authApi, endpoints } from "../../configs/APIs";
import { type } from "@testing-library/user-event/dist/type";

const Profile = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const [previewImage, setPreviewImage] = useState(null);
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profile, setProfile] = useState({
        email: user?.email || "",
        username: user?.username || "",
        password: "",
        role: user?.role || "",
        confirm: user?.isConfirm,
        avatar: user?.avatar || ""
    });

    const change = (evt, field) => {
        setProfile((current) => {
            return { ...current, [field]: evt.target.value };
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setProfile(prev => ({
                ...prev,
                avatar: file
            }));
        }
    };

    const handleConfirmAccount = async () => {
        try {
            setLoading(true);
            const res = await authApi().post(endpoints.confirm);
            if (res.status === 200) {
                Swal.fire({
                    title: "Xác thực thành công",
                    text: "Tài khoản của bạn đã được xác nhận.",
                    icon: "success",
                    confirmButtonText: "Đóng",
                    customClass: {
                        confirmButton: 'swal2-confirm'
                    }
                });
                dispatch({ type: "update", payload: { ...user, isConfirm: true } });
            }
        } catch (err) {
            const errorResponse = err.response?.data;
            const errorMessage = errorResponse && Array.isArray(errorResponse) && errorResponse.length > 0
                ? errorResponse[0].message
                : "Có lỗi xảy ra, vui lòng thử lại.";

            Swal.fire({
                title: "Xác thực thất bại",
                text: errorMessage,
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

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", profile.email);
        formData.append("username", profile.username);

        if (profile.password) {
            if (profile.password !== confirmPassword) {
                Swal.fire({
                    title: "Lỗi",
                    text: "Mật khẩu xác nhận không khớp!",
                    icon: "error",
                    confirmButtonText: "Đóng",
                    customClass: {
                        confirmButton: 'swal2-confirm'
                    }
                });
                return;
            }
            formData.append("password", profile.password);
        }

        if (typeof profile.avatar !== "string") {
            formData.append("avatar", profile.avatar);
        }

        try {
            setLoading(true);
            const res = await authApi().post(endpoints.updateProfile, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                Swal.fire({
                    title: "Cập nhật thành công",
                    text: "Hồ sơ của bạn đã được cập nhật. Bạn sẽ được đăng xuất ngay bây giờ.",
                    icon: "success",
                    confirmButtonText: "Đóng",
                    customClass: {
                        confirmButton: 'swal2-confirm'
                    }
                }).then(() => {
                    dispatch({ 
                        type: "logout",
                     });
                    nav("/login");
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="profile-container">
            <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
                <Row>
                    <Col sm={3}>
                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <img
                                className="rounded-circle shadow"
                                src={previewImage || profile.avatar || "https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service.png"}
                                alt="Avatar người dùng"
                                style={{
                                    width: 190,
                                    height: 190,
                                    objectFit: "cover",
                                }}
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

                        {!user.isConfirm && (
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
                                disabled={loading}
                            >
                                Xác nhận tài khoản
                            </Button>
                        )}

                        <Form className="profile-input">
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => change(e, "email")}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={profile.username}
                                    onChange={(e) => change(e, "username")}
                                />
                            </Form.Group>

                            <Row className="position-relative">
                                <Col md={6}>
                                    <Form.Group className="mb-3 position-relative">
                                        <Form.Label>Mật khẩu mới</Form.Label>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Mật khẩu"
                                            name="password"
                                            value={profile.password}
                                            onChange={(e) => change(e, "password")}
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
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Xác nhận mật khẩu"
                                            value={confirmPassword}
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
                                    value={profile.role}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={user?.isConfirmed ? "Đã xác thực" : "Chưa xác thực"}
                                    disabled
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
                                    Cập nhật hồ sơ
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default Profile;