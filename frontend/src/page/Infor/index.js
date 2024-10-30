import clsx from 'clsx';
import styles from './Infor.module.scss';
import { Button, Row, Form, Input, Col, InputNumber, DatePicker, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { getCookie } from '../../cookies';
import { useNavigate } from 'react-router-dom';
import { getCompanyById, updateCompany } from '../../services/CompanyService';
import moment from 'moment';
import { update } from '../../untils/request';
const { RangePicker } = DatePicker;
function Infor() {
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const hanleEdit = () => {
        setDisabled(!disabled);
    };
    const handleSubmit = async (e) => {
        console.log(update);
        setLoading(true);
        const time = e.workingTime;
        const idComapny = parseInt(getCookie('id'));
        const startTime = time[0] ? time[0].format('HH:mm') : null;
        const endTime = time[1] ? time[1].format('HH:mm') : null;
        const workingTime = `${startTime}-${endTime}`;
        const res = await updateCompany(
            {
                ...e,
                workingTime,
            },
            idComapny,
        );
        if (res) {
            message.success('Bạn đã cập nhập thành công !');
        } else {
            message.error('Cập nhập thất bại !');
        }
        setLoading(false);
    };
    useEffect(() => {
        const idComapny = parseInt(getCookie('id'));
        if (!idComapny) {
            navigate('/');
        } else {
            const fetchApi = async () => {
                const res = await getCompanyById(idComapny);
                const time = res.workingTime.split('-');
                const workingTime = [moment(time[0], 'HH:mm'), moment(time[1], 'HH:mm')];
                form.setFieldsValue({
                    ...res,
                    workingTime,
                });
            };
            fetchApi();
        }
    }, []);
    return (
        <div>
            <div className={clsx(styles.header)}>
                <div className={clsx(styles['header__title'])}>Thông tin công ty</div>
                <Button onClick={hanleEdit} className={clsx(styles['header__button'])}>
                    {disabled ? 'Chỉnh sửa' : 'Hủy'}
                </Button>
            </div>
            <Form disabled={disabled} onFinish={handleSubmit} form={form} layout="vertical">
                <Row gutter={[20, 0]} className={clsx(styles['body'])}>
                    <Col span={24}>
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
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
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
                                    message: 'Đây không phải là email !',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                        <Form.Item
                            label="Số diện thoại"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vào số diện thoại !',
                                },
                                {
                                    pattern: /^(03|05|07|08|09)\d{8}$/,
                                    message: 'Đây không phải là số diện thoại !',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vào địa chỉ !',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                        <Form.Item
                            label="Số nhân sự"
                            name="quantityPeople"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vào số nhận sự !',
                                },
                            ]}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                        <Form.Item
                            label="Thời gian làm việc"
                            name="workingTime"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vào thời gian làm việc !',
                                },
                            ]}
                        >
                            <RangePicker picker="time" format="HH:mm" />
                        </Form.Item>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                        <Form.Item
                            label="Link website"
                            name="website"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vào link website !',
                                },
                                {
                                    type: 'url',
                                    message: 'Đây không phải link của website !',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Mô tả ngắn"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vào mô tả ngắn !',
                                },
                            ]}
                        >
                            <TextArea allowClear showCount className={clsx(styles['text__description'])} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Mô tả chi tiết"
                            name="detail"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vào mô tả chi tiết !',
                                },
                            ]}
                        >
                            <TextArea allowClear showCount className={clsx(styles['text__detail'])} />
                        </Form.Item>
                    </Col>
                    {disabled || (
                        <Col span={24}>
                            <Form.Item>
                                <div>
                                    <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                                        Cập Nhập
                                    </Button>
                                    <Button onClick={hanleEdit} style={{ marginLeft: '1.5rem' }}>
                                        Hủy
                                    </Button>
                                </div>
                            </Form.Item>
                        </Col>
                    )}
                </Row>
            </Form>
        </div>
    );
}
export default Infor;
