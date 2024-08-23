import { useContext, useState } from "react";
import cookie from "react-cookies";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { MyUserContext } from "../../App";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { Button, Container, Form } from "react-bootstrap";

const Login = () => {
  const [user, dispatch] = useContext(MyUserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [q] = useSearchParams();
  const nav = useNavigate();
  if (cookie.load("token")) {
    nav("/");
  }
  const login = (evt) => {
    evt.preventDefault();

    const process = async () => {
      try {
        let res = await APIs.post(endpoints.login, {
          username: username,
          password: password,
        });
        console.log(res.data);
        cookie.save("token", res.data);

        let { data } = await authApi().get(endpoints.getCurrentUser);
        // console.log(data);

        cookie.save("user", data);

        dispatch({
          type: "login",
          payload: data,
        });
      } catch (err) {
        console.error(err);
      }
    };
    process();
  };

  if (user !== null) {
    let next = q.get("next") || "/";
    return <Navigate to={next} />;
  }

  return (
    <>
      <h2 style={{ color: "#009970" }} className="text-center mt-3">
        ĐĂNG NHẬP NGƯỜI DÙNG
      </h2>
      <Container>
        <Form onSubmit={login}>
          <Form.Group className="mb-3">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Tên đăng nhập"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Button variant="primary" type="submit">
              Đăng nhập
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
};

export default Login;
