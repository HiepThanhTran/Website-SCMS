import "./Profile.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { authApi, endpoints } from "../../configs/APIs";
import Swal from "sweetalert2";
import Loading from "../../layout/loading/Loading";
import { useNavigate } from "react-router-dom";

const ProfileSupplier = () => {
    const [name, setName] =  useState("");
    const [loading, setLoading] = useState(true);

    const loadProfileSupplier = async () => {
        try {
            let res = await authApi().get(endpoints.profileSupplier);
            
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProfileSupplier()
    },[]);

    return(
        <Container className="profile-container">
        {loading ? (
            <Loading />
        ) : (
            <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
                <Row>
                    <Col sm={12}>
                        <Row>
                            <Col sm={4}>
                                <Form.Group className="mb-3">
                                        <Form.Label>Tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                </Form.Group>
                            </Col>

                            <Col sm={4}>
                               
                            </Col>

                            <Col sm={4}>
                               
                            </Col>
                        </Row>

                        
                    </Col>
                </Row>
            </div>
        )}
    </Container>
    );
}

export default ProfileSupplier;