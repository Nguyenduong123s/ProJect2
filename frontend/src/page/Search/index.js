import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getJobs } from '../../services/JobServices';
import { clsx } from 'clsx';
import SearchItem from './SearchItem';
import { getCompanyById } from '../../services/CompanyService';
import styles from './Search.module.scss';
import { Col, Row, Tag } from 'antd';
import { getCookie } from '../../cookies';
function Search() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const city = searchParams.get('city');
    const keywordsParam = searchParams.get('tags');
    const keywords = keywordsParam.split(',') ? keywordsParam.split(',') : [];
    useEffect(() => {
        if (getCookie('tokenCompany')) {
            navigate('/admin');
        } else {
            const fetchApi = async () => {
                const allJobs = await getJobs();
                const filteredJobs = await Promise.all(
                    allJobs.map(async (job) => {
                        const res = await getCompanyById(job.idCompany);
                        const cityCompany = res.city;
                        const isCity = city == 'Tất cả thành phố' ? true : city == cityCompany;
                        const isKeywords = job.tags.some((tag) => {
                            let result;
                            if (keywords.includes(tag)) {
                                result = true;
                            } else {
                                const jobName = job.name.toLowerCase();
                                result = keywords.some((keyword) => {
                                    return jobName.includes(keyword.toLowerCase());
                                });
                            }
                            return result;
                        });
                        return isCity && isKeywords && job.status ? job : null;
                    }),
                );
                const result = filteredJobs.filter((job) => job !== null);
                setJobs(result);
            };
            fetchApi();
        }
    }, [city, keywordsParam]);
    return (
        <>
            <Row gutter={[0, 20]} className={clsx(styles['search'])}>
                <Col xxl={16} xl={16} lg={16} mg={16} sm={24} xs={24}>
                    <h3 className={clsx(styles['title'])}>
                        <p>{jobs.length}</p> Việc làm IT
                        <div className={clsx(styles['title__tag'])}>
                            {keywordsParam
                                ? keywords.map((tag, index) => (
                                      <Tag key={`tag-${index}`} color="processing">
                                          {`${tag}`}
                                      </Tag>
                                  ))
                                : ''}
                        </div>
                    </h3>
                </Col>

                {jobs.map((job) => (
                    <SearchItem job={job} />
                ))}
            </Row>
        </>
    );
}

export default Search;
