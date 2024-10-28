import { Modal, Form, Col, Row, Button, Input, message } from 'antd';
import { getCookie } from '../../../cookies';
import clsx from 'clsx';
import styles from './ModalForm.module.scss';
import { useRef, useState } from 'react';
import { postCV } from '../../../services/CVServices';
const { TextArea } = Input;
const formatDate = (date) => {
    const day = date.getDate();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
function ModalForm({ company, job, openModal, setOpenModal }) {
    const [loading, setLoading] = useState(false);
    const fileInput = useRef();
    const showFile = useRef();
    const handleCancel = () => {
        setOpenModal(false);
    };
    const handleUpload = async (file) => {
        try {
            const response = await fetch(
                'https://script.google.com/macros/s/AKfycbzejfqzHIfp6zHY3tPIM0LbJaJwma0vctAmVqUrILVanP-9wwX7dK21a4WA9zAtrpX_OQ/exec',
                {
                    method: 'POST',
                    body: JSON.stringify(file),
                },
            );
            const data = await response.json();
            return data.view;
        } catch (error) {
            message.error('Vui lòng thử lại');
        }
    };
    const handleSubmit = async (e) => {
        setLoading(true);
        const fileInput = document.getElementById('fileInput');
        const reader = new FileReader();
        const { cvFile, ...cv } = e;
        console.log(cv);
        reader.readAsDataURL(fileInput.files[0]);
        reader.addEventListener('load', async () => {
            const data = reader.result.split(',')[1];
            const postData = {
                name: fileInput.files[0].name,
                type: fileInput.files[0].type,
                data: data,
            };
            const resPostFile = await handleUpload(postData);
            if (resPostFile) {
                const now = new Date();
                const data = {
                    cvPDF: resPostFile,
                    idJob: job.id,
                    idCompany: company.id,
                    ...cv,
                    statusRead: false,
                    createAt: formatDate(now),
                    idUser: parseInt(getCookie('id')),
                };
                const resPostCv = await postCV(data);
                if (resPostCv) {
                    message.success('Bạn đã gửi CV thành công !');
                } else {
                    message.error('Vui lòng thử lại !');
                }
            }
            setLoading(false);
            setOpenModal(false);
        });
    };
    return (
        <Modal footer={null} centered open={openModal} width={1200} onCancel={() => setOpenModal(false)}>
            <div className={clsx(styles['infor-cv'])}>
                <div className={clsx(styles['infor-cv__header'])}>
                    <h3>BẠN ĐANG ỨNG TUYỂN VỊ TRÍ</h3>
                    <div className={clsx(styles['infor-cv__header--title'])}>
                        <h2>{job.name}</h2>
                        <h2>{`tại ${company.companyName}`}</h2>
                    </div>
                </div>
                <Form
                    onFinish={handleSubmit}
                    initialValues={{
                        name: getCookie('fullname'),
                        email: getCookie('username'),
                    }}
                    layout="vertical"
                    className={clsx(styles['infor-cv__body'])}
                >
                    <Row gutter={[0, 10]} className={clsx(styles['infor-cv__item'])}>
                        <Col xxl={3} xl={3} lg={3} md={24} sm={24} xs={24}>
                            <h2>
                                Thông tin<br></br> cơ bản
                            </h2>
                        </Col>
                        <Col
                            xxl={21}
                            xl={21}
                            lg={21}
                            md={24}
                            sm={24}
                            xs={24}
                            className={clsx(styles['infor-cv__item--form'])}
                        >
                            <Row justify="space-around">
                                <Col xxl={7} xl={7} lg={7} md={22} sm={22} xs={22}>
                                    <Form.Item
                                        label="Họ và tên"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập họ và tên !',
                                            },
                                            {
                                                pattern:
                                                    /^[A-ZĐ][a-zàáảãạâấầẩẫậăắằẳẵặèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]+\s([A-ZĐ][a-zàáảãạâấầẩẫậăắằẳẵặèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]+\s)*[A-ZĐ][a-zàáảãạâấầẩẫậăắằẳẵặèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]+$/,
                                                message: 'Đây không phải là tên một người !',
                                            },
                                        ]}
                                    >
                                        <Input disabled={loading} />
                                    </Form.Item>
                                </Col>
                                <Col xxl={7} xl={7} lg={7} md={22} sm={22} xs={22}>
                                    <Form.Item
                                        label="Số điện thoại"
                                        name="phone"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng vào số điện thoại',
                                            },
                                            {
                                                pattern: /^(03|05|07|08|09)\d{8}$/,
                                                message: 'Đây không phải là số điện thoại !',
                                            },
                                        ]}
                                    >
                                        <Input disabled={loading} placeholder="0912345678" />
                                    </Form.Item>
                                </Col>
                                <Col xxl={7} xl={7} lg={7} md={22} sm={22} xs={22}>
                                    <Form.Item label="Email" name="email">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={[0, 10]} className={clsx(styles['infor-cv__item'])}>
                        <Col xxl={3} xl={3} lg={3} md={24} sm={24} xs={24}>
                            <h2>Chọn CV</h2>
                        </Col>
                        <Col
                            xxl={21}
                            xl={21}
                            lg={21}
                            md={24}
                            sm={24}
                            xs={24}
                            className={clsx(styles['infor-cv__item--form'])}
                        >
                            <Row justify="space-around" style={{ alignItems: 'center' }}>
                                <Col xxl={21} xl={21} lg={21} md={22} sm={22} xs={22}>
                                    <div>
                                        <Form.Item
                                            style={{ display: 'none' }}
                                            name="cvFile"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng upload CV !',
                                                },
                                            ]}
                                        >
                                            <input
                                                accept="application/pdf"
                                                onChange={() => {
                                                    const fileInput = document.getElementById('fileInput');
                                                    const fileShow = document.getElementById('fileShow');
                                                    const fileName =
                                                        fileInput.files[0]?.name || 'Chưa có tệp nào được chọn';
                                                    fileShow.innerHTML = fileName;
                                                }}
                                                ref={fileInput}
                                                type="file"
                                                style={{ display: 'none' }}
                                                id="fileInput"
                                            />
                                        </Form.Item>
                                        <div>
                                            <Button disabled={loading} type="primary">
                                                <label for="fileInput">Tải lên CV (PDF)</label>
                                            </Button>
                                            <p id="fileShow" ref={showFile}>
                                                Chưa có tệp nào được chọn
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={[0, 10]} className={clsx(styles['infor-cv__item'])}>
                        <Col xxl={3} xl={3} lg={3} md={24} sm={24} xs={24}>
                            <h2>Thư giới thiệu</h2>
                        </Col>
                        <Col
                            xxl={21}
                            xl={21}
                            lg={21}
                            md={24}
                            sm={24}
                            xs={24}
                            className={clsx(styles['infor-cv__item--form'])}
                        >
                            <Row justify="space-around">
                                <Col xxl={22} xl={22} lg={22} md={22} sm={22} xs={22}>
                                    <Form.Item
                                        name="introduction"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập gửi thư giới thiệu !',
                                            },
                                        ]}
                                    >
                                        <TextArea
                                            disabled={loading}
                                            allowClear
                                            maxLength={500}
                                            showCount
                                            style={{ minHeight: '6rem' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className={clsx(styles['infor-cv__footer'])}>
                        <Button disabled={loading} onClick={handleCancel} style={{ marginRight: '1rem' }}>
                            Hủy
                        </Button>
                        <Form.Item>
                            <Button loading={loading} disabled={loading} htmlType="submit" type="primary">
                                Nộp CV
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </Modal>
    );
}

export default ModalForm;
