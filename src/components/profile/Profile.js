import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { MyUserContext } from "../../App";
import APIs, { endpoints } from "../../configs/APIs";

const Profile = () => {
  //   const [userRole, setUserRole] = useState("ROLE_CUSTOMER");
  const [user, dispatch] = useContext(MyUserContext);
  const [previewImage, setPreviewImage] = useState(null);
  const nav = useNavigate();
  const [error, setError] = useState({});
  const [profile, setProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    userRole: "",
    username: "",
    password: "",
    address: "",
    phone: "",
    contactInfo: "",
    name: "",
    avatar:
      "https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service.png",
  });
  const avatar = useRef(null);
  //   if (user === null) {
  //     nav("/login");
  //   }

  //   useEffect(() => {
  // const fetchProfile = async () => {
  //   let endpoint = endpoints.register;
  //   await APIs.get(`${endpoint}${id}`)
  //     .then((res) =>
  //       setProfile((preValues) => ({
  //         ...preValues,
  //         id: res.data.id,
  //         name: res.data.name,
  //         phone: res.data.phone,
  //         cccd: res.data.cccd,
  //         email: res.data.email,
  //         birth: res.data.birth,
  //         gender: res.data.gender,
  //         address: res.data.address,
  //         avatar: res.data.avatar,
  //       }))
  //     )
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // };
  // fetchProfile();
  //   }, [id]);
  const change = (evt, field) => {
    setProfile((current) => {
      return { ...current, [field]: evt.target.value };
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const processUser = async () => {
      let form = new FormData();
      for (let field in profile) {
        if (field !== "avatar") {
          form.append(field, profile[field]);
        }
      }
      form.append("avatar", avatar.current.files[0] || profile.avatar);
      let res = await APIs.post(endpoints.updateProfile, form);
      if (res.status === 200) {
        alert("Cập nhật thành công");
      }
    };
    const messageError = {};
    if (!profile.firstName.trim()) {
      messageError.firstName = "Họ không được bỏ trống";
    }
    if (!profile.middleName.trim()) {
      messageError.middleName = "Tên đệm không được bỏ trống";
    }
    if (!profile.lastName.trim()) {
      messageError.lastName = "Tên không được bỏ trống";
    }
    if (!profile.email.trim()) {
      messageError.email = "Email không được bỏ trống";
    }
    if (!profile.username.trim()) {
      messageError.username = "Tên đăng nhập không được bỏ trống";
    }
    if (!profile.password.trim()) {
      messageError.password = "Mật khẩu không được bỏ trống";
    }
    if (!profile.address.trim()) {
      messageError.address = "Địa chỉ không được bỏ trống";
    }
    if (!profile.phone.trim()) {
      messageError.phone = "Số điện thoại không được bỏ trống";
    }
    // if (profile.confirmPassword !== profile.password) {
    //   messageError.match = "Mật khẩu không trùng khớp";
    // }
    if (profile.userRole === "ROLE_SUPPLIER") {
      if (!profile.name.trim()) {
        messageError.name = "Tên nhà cung cấp không được bỏ trống";
      }
      if (!profile.contactInfo.trim()) {
        messageError.contactInfo = "Thông tin liên hệ không được bỏ trống";
      }
    }
    setError(messageError);

    if (Object.keys(messageError).length > 0) {
      return;
    }
    // const messageError = {};
    // if (!profile.name.trim()) {
    //   messageError.name = "Họ và tên không được bỏ trống";
    // } else if (profile.name.length < 3) {
    //   messageError.name = "Họ và tên tối thiểu 3 ký tự";
    // }

    // if (!profile.phone.trim()) {
    //   messageError.phone = "Số điện thoại không được để trống";
    // } else if (profile.phone.length !== 10) {
    //   messageError.phone = "Số điện thoại phải đúng 10 ký tự";
    // }

    // if (profile.cccd.length !== 12) {
    //   messageError.cccd = "Căn cước công dân phải đủ 12 ký tự";
    // }

    // if (!profile.email.trim()) {
    //   messageError.email = "Địa chỉ email không được để trống";
    // } else if (!validateEmail(profile.email)) {
    //   messageError.email = "Vui lòng nhập đúng định dạng email";
    // }

    // if (!profile.address.trim()) {
    //   messageError.gender = "Địa chỉ không được để trống";
    // } else if (profile.address.length < 40) {
    //   messageError.address = "Vui lòng nhập địa chỉ chi tiết";
    // }
    // setError(messageError);

    // if (Object.keys(messageError).length === 0) {
    //   await processUser();
    // }
  };
  //   const validateEmail = (email) => {
  //     // Biểu thức chính quy để kiểm tra địa chỉ email
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     return emailRegex.test(email);
  //   };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Container className="mt-3" style={{ height: "100%" }}>
        <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
          <Row>
            <Col sm={3}>
              <div className="d-flex flex-column align-items-center justify-content-center">
                <img
                  className="rounded-circle shadow"
                  src={previewImage || profile.avatar}
                  style={{ width: 190, height: 190, objectFit: "cover" }}
                  alt="Ảnh tạm thời"
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
                  onChange={handleImageChange}
                  ref={avatar}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
            </Col>

            <Col sm={9}>
              <div>
                <h3
                  style={{ background: "#009970" }}
                  className="text-white p-3"
                >
                  Thông tin cá nhân
                </h3>
                <div
                  style={{
                    maxHeight: "570px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <Form>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Họ</Form.Label>
                          <Form.Control
                            value={profile.name}
                            onChange={(e) => change(e, "firstName")}
                            type="text"
                            placeholder="Họ"
                          />
                          {error.firstName && (
                            <span className="text-danger">
                              {error.firstName}
                            </span>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tên đệm</Form.Label>
                          <Form.Control
                            value={profile.middleName}
                            onChange={(e) => change(e, "middleName")}
                            type="text"
                            placeholder="Tên đệm"
                          />
                          {error.middleName && (
                            <span className="text-danger">
                              {error.middleName}
                            </span>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tên</Form.Label>
                          <Form.Control
                            value={profile.lastName}
                            onChange={(e) => change(e, "lastName")}
                            type="text"
                            placeholder="Tên"
                          />
                          {error.lastName && (
                            <span className="text-danger">
                              {error.lastName}
                            </span>
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
                            value={profile.email}
                            onChange={(e) => change(e, "email")}
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
                            Vai trò người dùng (
                            <span className="text-danger">*</span>)
                          </Form.Label>
                          <Form.Select
                            value={profile.userRole}
                            onChange={(e) => change(e, "userRole")}
                            disabled
                          >
                            <option value="ROLE_CUSTOMER">Khách hàng</option>
                            <option value="ROLE_SUPPLIER">Nhà cung cấp</option>
                            {/* <option value="ROLE_DISTRIBUTOR">Nhà phân phối</option>
                          <option value="ROLE_MANUFACTURER">Nhà sản xuất</option> */}
                            <option value="ROLE_SHIPPER">
                              Người giao hàng
                            </option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Tên đăng nhập (<span className="text-danger">*</span>)
                      </Form.Label>
                      <Form.Control
                        value={profile.username}
                        onChange={(e) => change(e, "username")}
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
                        value={profile.password}
                        onChange={(e) => change(e, "password")}
                        type="password"
                        placeholder="Mật khẩu"
                      />
                      {error.password && (
                        <span className="text-danger">{error.password}</span>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Địa chỉ(<span className="text-danger">*</span>)
                      </Form.Label>
                      <Form.Control
                        value={profile.address}
                        onChange={(e) => change(e, "address")}
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
                        value={profile.phone}
                        onChange={(e) => change(e, "phone")}
                        type="text"
                        placeholder="Số điện thoại"
                      />
                      {error.phone && (
                        <span className="text-danger">{error.phone}</span>
                      )}
                    </Form.Group>
                    {profile.userRole === "ROLE_SUPPLIER" && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>Thông tin liên hệ</Form.Label>
                          <Form.Control
                            value={profile.contactInfo}
                            onChange={(e) => change(e, "contactInfo")}
                            type="text"
                            placeholder="Thông tin liên hệ"
                          />
                          {error.contactInfo && (
                            <span className="text-danger">
                              {error.contactInfo}
                            </span>
                          )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Tên nhà cung cấp(
                            <span className="text-danger">*</span>)
                          </Form.Label>
                          <Form.Control
                            value={profile.name}
                            onChange={(e) => change(e, "name")}
                            type="text"
                            placeholder="Tên nhà cung cấp"
                          />
                          {error.name && (
                            <span className="text-danger">{error.name}</span>
                          )}
                        </Form.Group>
                      </>
                    )}

                    <Form.Group className="mb-3 d-flex justify-content-end">
                      <Button onClick={handleUpdateProfile}>Cập nhật</Button>
                    </Form.Group>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Profile;
