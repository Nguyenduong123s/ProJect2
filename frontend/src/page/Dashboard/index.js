import { Card, Col, Row } from 'antd';
import styles from './Dashboard.module.scss';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { getCookie } from '../../cookies';
import { useNavigate } from 'react-router-dom';
import { getTotalJob } from '../../services/JobServices';
import { getTotalCV } from '../../services/CVServices';
import { getCompanyById } from '../../services/CompanyService';
function Dashboard() {
    const [jobQuantity, setJobQuantity] = useState({});
    const [cvQuantity, setCvQuantity] = useState({});
    const [company, setCompany] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const idCompany = parseInt(getCookie('id'));
        if (!idCompany) {
            navigate('/');
        } else {
            const fetchApi = async (idCompany) => {
                const responeJob = await getTotalJob(idCompany);
                const responeCV = await getTotalCV(idCompany);
                const responeCompany = await getCompanyById(idCompany);
                setCompany(responeCompany);
                setJobQuantity(responeJob);
                setCvQuantity(responeCV);
            };
            fetchApi(idCompany);
        }
    }, []);
    return (
        <>
            <div className={clsx(styles.title)}>Tổng quan</div>
            <Row gutter={[30, 30]} className={clsx(styles.card)}>
                <Col xxl={8} xl={8} lg={12} md={12} sm={24} xs={24}>
                    <Card title="Job" className={clsx(styles['card__item'])}>
                        <p>
                            Số lượng job : <b>{jobQuantity.totalJob}</b>
                        </p>
                        <p>
                            Job đang bật : <b>{jobQuantity.jobOn}</b>
                        </p>
                        <p>
                            Job đang tắt : <b>{jobQuantity.jobOff}</b>
                        </p>
                    </Card>
                </Col>
                <Col xxl={8} xl={8} lg={12} md={12} sm={24} xs={24}>
                    <Card title="CV" className={clsx(styles['card__item'])}>
                        <p>
                            Số lượng cv : <b>{cvQuantity.totalCv}</b>
                        </p>
                        <p>
                            Cv đang bật : <b>{cvQuantity.cvOn}</b>
                        </p>
                        <p>
                            Cv đang tắt : <b>{cvQuantity.cvOff}</b>
                        </p>
                    </Card>
                </Col>
                <Col xxl={8} xl={8} lg={12} md={12} sm={24} xs={24}>
                    <Card title="Thông tin công ty" className={clsx(styles['card__item'])}>
                        <p>
                            Tên công ty : <b>{company.companyName}</b>
                        </p>
                        <p>
                            Email : <b>{company.email}</b>
                        </p>
                        <p>
                            Số diện thoại : <b>{company.phone}</b>
                        </p>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default Dashboard;
