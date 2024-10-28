import { useEffect, useRef, useState } from 'react';
import { getCompanyById } from '../../../services/CompanyService';
import { Col, Tag } from 'antd';
import styles from './SearchItem.module.scss';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
function SearchItem({ job }) {
    const [company, setCompany] = useState({ companyName: '' });
    const timeElement = useRef();
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(`/detail-job/${job.id}`);
    };
    useEffect(() => {
        const fetchApi = async () => {
            const result = await getCompanyById(job.idCompany);
            const currentDate = new Date();
            const [date, clock] = job.createAt.split(' ');
            const timeDate = date.split('-');
            const timeClock = clock.split(':');
            if (currentDate.getFullYear() > parseInt(timeDate[2])) {
                if (currentDate.getMonth() + 1 >= parseInt(timeDate[1])) {
                    timeElement.current.innerText = '1 năm trước';
                } else {
                    if (currentDate.getDate() + 1 <= parseInt(timeDate[0])) {
                        timeElement.current.innerText = `${
                            currentDate.getMonth() + 1 + 12 - parseInt(timeDate[1])
                        } tháng trước`;
                    } else {
                        timeElement.current.innerText = `${
                            currentDate.getMonth() + 12 - parseInt(timeDate[1])
                        } tháng trước`;
                    }
                }
            } else {
                if (currentDate.getMonth() + 1 > parseInt(timeDate[1])) {
                    if (currentDate.getDate() + 1 <= parseInt(timeDate[0])) {
                        timeElement.current.innerText = `${
                            currentDate.getMonth() + 1 - parseInt(timeDate[1])
                        } tháng trước`;
                    } else {
                        timeElement.current.innerText = `${currentDate.getMonth() - parseInt(timeDate[1])} tháng trước`;
                    }
                } else if (currentDate.getMonth() + 1 == parseInt(timeDate[1])) {
                    if (currentDate.getDate() > parseInt(timeDate[0]) > 0) {
                        timeElement.current.innerText = `${currentDate.getDate() - parseInt(timeDate[0])} ngày trước`;
                    } else {
                        timeElement.current.innerText = `gần đây`;
                    }
                }
            }
            setCompany(result);
        };
        fetchApi();
    }, []);
    return (
        <Col
            className={clsx(styles['search-item'])}
            key={`searchItem-${job.id}`}
            xxl={16}
            xl={16}
            lg={16}
            mg={16}
            sm={24}
            xs={24}
            onClick={handleNavigate}
        >
            <p className={clsx(styles['infor__job-name'])}>{job.name.toUpperCase()}</p>
            <p className={clsx(styles['infor__company-name'])}>{company.companyName.toUpperCase()}</p>
            <p className={clsx(styles['infor__salary'])}>Mức lương : {job.salary} USD</p>
            <p className={clsx(styles['infor__address'])}>Địa chỉ : {company.address}</p>
            <div className={clsx(styles['infor__tag'])}>
                <div>
                    {job.tags.map((tag, index) => (
                        <Tag key={`tag-${index}`} color="processing">
                            {tag}
                        </Tag>
                    ))}
                </div>
                <p ref={timeElement} className={clsx(styles['infor__time'])}></p>
            </div>
        </Col>
    );
}

export default SearchItem;
