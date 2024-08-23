import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";
import APIs, { endpoints } from "../../configs/APIs"; // Giả định APIs đã được thiết lập

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState("ROLE_CUSTOMER");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [error, setError] = useState({});

  const nav = useNavigate();

  const register = async (evt) => {
    evt.preventDefault();

    try {
      const messageError = {};
      if (!firstName.trim()) {
        messageError.firstName = "Họ không được bỏ trống";
      }
      if (!middleName.trim()) {
        messageError.middleName = "Tên đệm không được bỏ trống";
      }
      if (!lastName.trim()) {
        messageError.lastName = "Tên không được bỏ trống";
      }
      if (!email.trim()) {
        messageError.email = "Email không được bỏ trống";
      }
      if (!username.trim()) {
        messageError.username = "Tên đăng nhập không được bỏ trống";
      }
      if (!password.trim()) {
        messageError.password = "Mật khẩu không được bỏ trống";
      }
      if (!address.trim()) {
        messageError.address = "Địa chỉ không được bỏ trống";
      }
      if (!phone.trim()) {
        messageError.phone = "Số điện thoại không được bỏ trống";
      }
      if (confirmPassword !== password) {
        messageError.match = "Mật khẩu không trùng khớp";
      }
      if (userRole === "ROLE_SUPPLIER") {
        if (!name.trim()) {
          messageError.name = "Tên nhà cung cấp không được bỏ trống";
        }
        if (!contactInfo.trim()) {
          messageError.contactInfo = "Thông tin liên hệ không được bỏ trống";
        }
      }
      setError(messageError);

      if (Object.keys(messageError).length > 0) {
        return;
      }
      const res = await APIs.post(endpoints.register, {
        email,
        username,
        password,
        userRole,
        firstName,
        middleName,
        lastName,
        name,
        address,
        phone,
        contactInfo,
      });

      cookie.save("token", res.data.token);
      cookie.save("user", res.data.user);

      nav("/"); // Điều hướng về trang chủ hoặc trang cần thiết sau khi đăng ký thành công
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h2 style={{ color: "#009970" }} className="text-center mt-3">
        ĐĂNG KÝ NGƯỜI DÙNG
      </h2>
      <Container>
        <Form onSubmit={register}>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Họ (<span className="text-danger">*</span>)
                </Form.Label>
                <Form.Control
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="Họ"
                />
                {error.firstName && (
                  <span className="text-danger">{error.firstName}</span>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Tên đệm (<span className="text-danger">*</span>)
                </Form.Label>
                <Form.Control
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  type="text"
                  placeholder="Tên đệm"
                />
                {error.middleName && (
                  <span className="text-danger">{error.middleName}</span>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Tên (<span className="text-danger">*</span>)
                </Form.Label>
                <Form.Control
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Tên"
                />
                {error.lastName && (
                  <span className="text-danger">{error.lastName}</span>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email (<span className="text-danger">*</span>)
                </Form.Label>
                <Form.Control
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                />
                {error.email && (
                  <span className="text-danger">{error.email}</span>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Vai trò người dùng (<span className="text-danger">*</span>)
                </Form.Label>
                <Form.Select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="ROLE_CUSTOMER">Khách hàng</option>
                  <option value="ROLE_SUPPLIER">Nhà cung cấp</option>
                  {/* <option value="ROLE_DISTRIBUTOR">Nhà phân phối</option>
                  <option value="ROLE_MANUFACTURER">Nhà sản xuất</option> */}
                  <option value="ROLE_SHIPPER">Người giao hàng</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              Tên đăng nhập (<span className="text-danger">*</span>)
            </Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Tên đăng nhập"
            />
            {error.username && (
              <span className="text-danger">{error.username}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Mật khẩu (<span className="text-danger">*</span>)
            </Form.Label>
            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Mật khẩu"
            />
            {error.password && (
              <span className="text-danger">{error.password}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Xác nhận mật khẩu(<span className="text-danger">*</span>):
            </Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu..."
            />
            {error.match && <span className="text-danger">{error.match}</span>}
          </Form.Group>
          {userRole === "ROLE_SUPPLIER" && (
            <Form.Group className="mb-3">
              <Form.Label>
                Tên nhà cung cấp(<span className="text-danger">*</span>)
              </Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Tên nhà cung cấp"
              />
              {error.name && <span className="text-danger">{error.name}</span>}
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>
              Địa chỉ(<span className="text-danger">*</span>)
            </Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="Địa chỉ"
            />
            {error.address && (
              <span className="text-danger">{error.address}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Số điện thoại(<span className="text-danger">*</span>)
            </Form.Label>
            <Form.Control
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              placeholder="Số điện thoại"
            />
            {error.phone && <span className="text-danger">{error.phone}</span>}
          </Form.Group>
          {userRole === "ROLE_SUPPLIER" && (
            <Form.Group className="mb-3">
              <Form.Label>
                Thông tin liên hệ(<span className="text-danger">*</span>)
              </Form.Label>
              <Form.Control
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                type="text"
                placeholder="Thông tin liên hệ"
              />
              {error.contactInfo && (
                <span className="text-danger">{error.contactInfo}</span>
              )}
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Button variant="primary" type="submit">
              Đăng ký
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
};

export default Register;
