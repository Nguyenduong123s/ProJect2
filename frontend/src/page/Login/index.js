import clsx from 'clsx';
import styles from './Login.module.scss';
import { Col, Form, Input, Row, message } from 'antd';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { checkLogin } from '../../services/UserServices';
import { getCookie, setCookie } from '../../cookies';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../action/login';
import { Link } from 'react-router-dom';
import { checkLoginCompany } from '../../services/CompanyService';
function Login() {
    const [isCompany, setIsCompany] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        if (!isCompany) {
            setLoading(true);
            const check = await checkLogin(e.username, e.password);
            if (!check.username) {
                messageApi.open({
                    type: 'error',
                    content: 'Email không tồn tại !',
                });
                setLoading(false);
            } else {
                if (check.password) {
                    setCookie('id', check.user.id, 1);
                    setCookie('username', e.username, 1);
                    setCookie('password', e.password, 1);
                    setCookie('token', check.user.token, 1);
                    setCookie('fullname', check.user.fullname, 1);
                    navigate(-1);
                    setLoading(false);
                } else {
                    messageApi.open({
                        type: 'error',
                        content: 'Mật khẩu của bạn nhập đã sai',
                    });
                    setLoading(false);
                }
            }
        } else {
            setLoading(true);
            const check = await checkLoginCompany(e.username, e.password);
            if (!check.email) {
                messageApi.open({
                    type: 'error',
                    content: 'Email không tồn tại !',
                });
                setLoading(false);
            } else {
                if (check.password) {
                    setCookie('id', check.user.id, 1);
                    setCookie('email', e.email, 1);
                    setCookie('tokenCompany', check.user.token, 1);
                    setCookie('companyName', check.user.companyName, 1);
                    navigate('/admin');
                    setLoading(false);
                } else {
                    messageApi.open({
                        type: 'error',
                        content: 'Mật khẩu của bạn nhập đã sai',
                    });
                    setLoading(false);
                }
            }
        }
    };
    useEffect(() => {
        if (getCookie('token')) {
            dispatch(login());
            navigate('/');
        } else if (getCookie('tokenCompany')) {
            dispatch(login());
            navigate('/admin');
        }
    }, []);
    return (
        <div className={clsx(styles['login'])}>
            {contextHolder}
            <Row className={clsx(styles['row-custom'])}>
                <Col xxl={14} xl={14} lg={14} md={24} sm={24} xs={24} className={clsx(styles['login__form'])}>
                    <Form layout="vertical" onFinish={handleSubmit} className={clsx(styles['login__form--item'])}>
                        <div className={clsx(styles['option-login'])}>
                            <div className={clsx(styles['option-login__header'])}>
                                <h2>Chào mừng bạn đến với IT Jobs</h2>
                                <p>Đăng nhập để sử dụng dịch vụ của chúng tôi</p>
                            </div>
                            <div className={clsx(styles['option-login__select'])}>
                                <Button
                                    type={isCompany ? '' : 'primary'}
                                    onClick={() => setIsCompany(false)}
                                    style={{ marginRight: '20px' }}
                                >
                                    Ứng viên
                                </Button>
                                <Button type={isCompany ? 'primary' : ''} onClick={() => setIsCompany(true)}>
                                    Nhà tuyển dụng
                                </Button>
                            </div>
                        </div>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vào username !',
                                },
                                {
                                    type: 'email',
                                    message: 'Đây không phải làm email',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vào password!',
                                },
                                {
                                    pattern: /^(?=.*[A-Z]).{8,}$/,
                                    message: 'Mật khẩu cần ít nhất 8 kí tự và 1 kí tự hoa',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary" loading={loading} disabled={loading}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col xxl={10} xl={10} lg={10} md={24} sm={0} xs={0} className={clsx(styles['banner'])}>
                    <div className={clsx(styles['banner__logo'])}>
                        <Link to="/">IT Jobs</Link>
                    </div>
                    <h1>
                        Tiếp lợi thế
                        <br />
                        Nối thành công
                    </h1>
                    <p>
                        IT Jobs - Hệ sinh thái nhân sự tiên phong ứng <br /> dụng công nghệ tại Việt Nam
                    </p>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
