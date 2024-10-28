import clsx from 'clsx';
import styles from './Register.module.scss';
import { Col, Form, InputNumber, Input, Row, message, Select } from 'antd';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { checkEmail, postUser } from '../../services/RegisterUserServices';
import { checkEmailCompany, postUserCompany } from '../../services/RegisterCompanyServices';
import { getCity } from '../../services/CityServices';
function Register() {
    const [optionCity, setOptionCity] = useState([]);
    const [isCompany, setIsCompany] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        setLoading(true);
        const check = await checkEmail(e.username);
        if (check) {
            messageApi.open({
                type: 'error',
                content: 'Email đã tồn tại vui lòng nhập email khác !',
            });
            setLoading(false);
        } else {
            const Chance = require('chance');
            const chance = new Chance();
            const token = chance.string({ length: 15 });
            const res = await postUser({
                username: e.username,
                fullname: e.fullname,
                password: e.password,
                token,
            });
            if (res) {
                navigate('/login');
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Đăng kí không thành công !',
                });
                setLoading(false);
            }
        }
    };
    const handleSubmitCompany = async (e) => {
        setLoading(false);
        const check = await checkEmailCompany(e.email);
        if (check) {
            messageApi.open({
                type: 'error',
                content: 'Email đã tồn tại vui lòng nhập email khác !',
            });
            setLoading(false);
        } else {
            const Chance = require('chance');
            const chance = new Chance();
            const token = chance.string({ length: 15 });
            const { rePassword, ...value } = e;
            const res = await postUserCompany({ ...value, token });
            if (res) {
                navigate('/login');
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Đăng kí không thành công !',
                });
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        const fetchApi = async () => {
            const res = await getCity();
            const result = res.map((value) => ({
                value: value.name,
                key: value.id + 1,
            }));
            setOptionCity(result);
        };
        fetchApi();
    }, []);
    return (
        <div className={clsx(styles['register'])}>
            {contextHolder}
            <Row className={clsx(styles['row-custom'])}>
                <Col xxl={14} xl={14} lg={14} md={24} sm={24} xs={24} className={clsx(styles['register__form'])}>
                    {!isCompany ? (
                        <Form
                            layout="vertical"
                            onFinish={handleSubmit}
                            className={clsx(styles['register__form--item'])}
                        >
                            <div className={clsx(styles['option-register'])}>
                                <div className={clsx(styles['option-register__header'])}>
                                    <h2>Chào mừng bạn đến với IT Jobs</h2>
                                    <p>Đăng kí để sử dụng dịch vụ của chúng tôi</p>
                                </div>
                                <div className={clsx(styles['option-register__select'])}>
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
                                label="Email"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào email !',
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
                                label="Họ và tên"
                                name="fullname"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào email !',
                                    },
                                    {
                                        pattern:
                                            /^[A-ZĐ][a-zàáảãạâấầẩẫậăắằẳẵặèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]+\s([A-ZĐ][a-zàáảãạâấầẩẫậăắằẳẵặèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]+\s)*[A-ZĐ][a-zàáảãạâấầẩẫậăắằẳẵặèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]+$/,
                                        message: 'Đây không phải là tên một người!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
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

                            <Form.Item
                                label="Nhập lại mật khẩu"
                                name="rePassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào password!',
                                    },
                                    {
                                        pattern: /^(?=.*[A-Z]).{8,}$/,
                                        message: 'Mật khẩu cần ít nhất 8 kí tự và 1 kí tự hoa',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" type="primary" loading={loading} disabled={loading}>
                                    Đăng kí
                                </Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        <Form
                            layout="vertical"
                            onFinish={handleSubmitCompany}
                            className={clsx(styles['register__form--company'])}
                        >
                            <div className={clsx(styles['option-register'])}>
                                <div className={clsx(styles['option-register__header'])}>
                                    <h2>Chào mừng bạn đến với IT Jobs</h2>
                                    <p>Đăng kí để sử dụng dịch vụ của chúng tôi</p>
                                </div>
                                <div className={clsx(styles['option-register__select'])}>
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
                                label="Tên công ty"
                                name="companyName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào tên công ty !',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào email !',
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
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào email !',
                                    },
                                    {
                                        pattern: /^(03|05|07|08|09)\d{8}$/,
                                        message: 'Đây không phải là số điện thoại !',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
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

                            <Form.Item
                                label="Nhập lại mật khẩu"
                                name="rePassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào password!',
                                    },
                                    {
                                        pattern: /^(?=.*[A-Z]).{8,}$/,
                                        message: 'Mật khẩu cần ít nhất 8 kí tự và 1 kí tự hoa',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="Thành phố"
                                name="city"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào Địa chỉ!',
                                    },
                                ]}
                            >
                                <Select options={optionCity}></Select>
                            </Form.Item>
                            <Form.Item
                                label="Địa chỉ cụ thể"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào Địa chỉ!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Website"
                                name="website"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào website !',
                                    },
                                    {
                                        type: 'url',
                                        message: 'Vui lòng nhập đúng đường link website !',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Số lượng nhân viên"
                                name="passwquantityPeopleord"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào sô lượng nhân viên !',
                                    },
                                ]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" type="primary" loading={loading} disabled={loading}>
                                    Đăng kí
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
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

export default Register;
