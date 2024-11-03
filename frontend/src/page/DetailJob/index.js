import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getJobById } from '../../services/JobServices';
import { getCompanyById } from '../../services/CompanyService';
import { Row, Col, Button, Tag, Tabs } from 'antd';
import styles from './DetailJob.module.scss';
import './index.scss';
import clsx from 'clsx';
import { EnvironmentOutlined, FieldTimeOutlined, PoundCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { getCookie } from '../../cookies';
import ModalForm from './ModalForm';
function DetailJob() {
    const params = useParams();
    const jobId = parseInt(params.id);
    const [job, setJob] = useState({});
    const [company, setCompany] = useState({});
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const handleClick = () => {
        if (getCookie('token')) {
            setOpenModal(true);
        } else {
            navigate('/login');
        }
    };
    const items = [
        {
            key: '1',
            label: 'Mô tả công việc',
            children: (
                <>
                    <div className={clsx(styles['detail-job__description--item'])}>
                        <h3>Trách nhiệm công việc</h3>
                        <ul>
                            {(job.description ? job.description.responsibilities : []).map((value, index) => (
                                <li key={`responsibilities-${index}`}>{value}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={clsx(styles['detail-job__description--item'])}>
                        <h3>Kỹ năng và chuyên môn</h3>
                        <ul>
                            {(job.description ? job.description.skills : []).map((value, index) => (
                                <li key={`responsibilities-${index}`}>{value}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={clsx(styles['detail-job__description--item'])}>
                        <h3>Phúc lợi dành cho bạn</h3>
                        <ul>
                            {(job.description ? job.description.benefits : []).map((value, index) => (
                                <li key={`responsibilities-${index}`}>{value}</li>
                            ))}
                        </ul>
                    </div>
                </>
            ),
        },
        {
            key: '2',
            label: 'Thông tin công ty',
            children: (
                <div className={clsx(styles['infor-company'])}>
                    <div className={clsx(styles['infor-company__item'])}>
                        <h3>Tổng quan về công ty</h3>
                        <p>{company.description}</p>
                    </div>
                    <div className={clsx(styles['infor-company__item'])}>
                        <h3>Thông tin chi tiết về công ty</h3>
                        <p>{company.detail}</p>
                    </div>
                </div>
            ),
        },
    ];
    useEffect(() => {
        if (getCookie('tokenCompany')) {
            navigate('/admin');
        } else {
            const fetchApi = async () => {
                const resJob = await getJobById(jobId);
                const resCompany = await getCompanyById(resJob.idCompany);
                setCompany(resCompany);
                setJob(resJob);
            };
            fetchApi();
        }
    }, []);
    return (
        <>
            <Row gutter={[25, 25]} className={clsx(styles['detail-job'])} justify={'center'}>
                <Col xxl={14} xl={15} lg={14} md={20} sm={22} xs={22}>
                    <Row gutter={[0, 30]} justify="center" style={{ width: '100%' }}>
                        <Col className={clsx(styles['detail-job__company'])} span={24}>
                            <h2 className={clsx(styles['detail-job__name-job'])}>{job.name}</h2>
                            <p className={clsx(styles['detail-job__name-company'])}>{company.companyName}</p>
                            <p className={clsx(styles['detail-job__address'])}>
                                <EnvironmentOutlined className={clsx(styles.icon)} />
                                {`Địa chỉ : ${company.address}`}
                            </p>
                            <p className={clsx(styles['detail-job__time'])}>
                                <FieldTimeOutlined className={clsx(styles.icon)} />
                                {`Ngày đăng : ${job.createAt}`}
                            </p>
                            <p className={clsx(styles['detail-job__salary'])}>
                                <PoundCircleOutlined className={clsx(styles.icon)} />
                                {`Lương : ${job.salary} USD`}
                            </p>
                        </Col>
                        <Col className={clsx(styles['detail-job__description'])} span={24}>
                            <Tabs defaultActiveKey="1" items={items} className="tabs" />
                        </Col>
                    </Row>
                </Col>
                <Col className={clsx(styles['detail-job__infor'])} xxl={7} xl={7} lg={14} md={20} sm={22} xs={22}>
                    <Button
                        onClick={handleClick}
                        type="primary"
                        block
                        className={clsx(styles['detail-job__infor--button'])}
                    >
                        Ứng tuyển ngay
                    </Button>
                    <div className={clsx(styles['detail-job__infor--main'])}>
                        <h2>Thông tin chung</h2>
                        <div className={clsx(styles['infor'])}>
                            <h3>Thời gian làm việc</h3>
                            <p>{company.workingTime}</p>
                        </div>
                        <div className={clsx(styles['infor'])}>
                            <h3>Website</h3>
                            <p>{company.website}</p>
                        </div>
                        <div className={clsx(styles['infor'])}>
                            <h3>Số lượng nhân viên</h3>
                            <p>{company.quantityPeople}</p>
                        </div>
                        <div className={clsx(styles['infor'])}>
                            <h3>Các công nghệ sử dụng</h3>
                            <div>
                                {(job.tags ? job.tags : []).map((tag, index) => (
                                    <Tag color="processing" key={index}>
                                        {tag}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <ModalForm job={job} company={company} openModal={openModal} setOpenModal={setOpenModal} />
        </>
    );
}

export default DetailJob;
