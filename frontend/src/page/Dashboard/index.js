import { Card, Col, Row } from 'antd';
import styles from './Dashboard.module.scss';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { getCookie } from '../../cookies';
import { useNavigate } from 'react-router-dom';
import { getTotalJob } from '../../services/JobServices';
function Dashboard() {
    const [jobQuantity, setJobQuantity] = useState({});
    const navigate = useNavigate();
    console.log(jobQuantity);
    useEffect(() => {
        const idCompany = parseInt(getCookie('id'));
        if (!idCompany) {
            navigate('/');
        } else {
            const fetchApi = async (idCompany) => {
                const res = await getTotalJob(idCompany);
                setJobQuantity(res);
            };
            fetchApi(idCompany);
        }
    }, []);
    return (
        <>
            <div className={clsx(styles.title)}>Tổng quan</div>
            <Row justify="space-around" className={clsx(styles.card)}>
                <Col span={7}>
                    <Card title="Job">
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
                <Col span={7}>
                    <Card title="CV">
                        <p>
                            Số lượng CV : <b>6</b>
                        </p>
                        <p>
                            CV đã đọc : <b>5</b>
                        </p>
                        <p>
                            CV chưa đọc : <b>1</b>
                        </p>
                    </Card>
                </Col>
                <Col span={7}>
                    <Card title="Thông tin công ty" span={7}>
                        <p>
                            Tên công ty : <b>6</b>
                        </p>
                        <p>
                            Email : <b>5</b>
                        </p>
                        <p>
                            Số diện thoại : <b>1</b>
                        </p>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default Dashboard;
