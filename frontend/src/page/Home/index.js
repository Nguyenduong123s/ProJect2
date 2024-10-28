import { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import clsx from 'clsx';
import { Button, Select, Tag } from 'antd';
import { getCity } from '../../services/CityServices';
import { getTags } from '../../services/TagServices';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCookie } from '../../cookies';
function Home() {
    const [optionCity, setOptionCity] = useState([]);
    const [optionTag, setOptionTag] = useState([]);
    const [dataParams, setDataPrams] = useState({
        city: 'Tất cả thành phố',
    });
    const navigate = useNavigate();
    const handleChangeTag = (value) => {
        setDataPrams({
            ...dataParams,
            tags: value,
        });
    };
    const handleChangeCity = (value) => {
        setDataPrams({
            ...dataParams,
            city: value,
        });
    };
    const handleSubmit = () => {
        navigate(`/search?city=${dataParams.city}&tags=${dataParams.tags ? dataParams.tags : ''}`);
    };
    const handleClickTag = async (tag) => {
        navigate(`/search?city=${dataParams.city}&tags=${tag ? tag : ''}`);
    };
    useEffect(() => {
        if (getCookie('tokenCompany')) {
            navigate('/admin');
        } else {
            const fetchApiCity = async () => {
                const res = await getCity();
                const result = res.map((city) => ({
                    value: city.name,
                    key: `city-${city.id + 1}`,
                }));
                result.push({ key: result.length + 1, value: 'Tất cả thành phố' });
                setOptionCity(result);
            };
            const fetchApiTag = async () => {
                const res = await getTags();
                const result = res.map((tag) => ({
                    value: tag.name,
                    key: `tag-${tag.id + 1}`,
                }));
                setOptionTag(result);
            };
            fetchApiTag();
            fetchApiCity();
        }
    }, []);
    return (
        <div className={clsx(styles['home'])}>
            <div className={clsx(styles['home__search'])}>
                <h1 className={clsx(styles['home__search--title'])}>IT Jobs For Developer</h1>
                <div className={clsx(styles['home__search--form'])}>
                    <Select
                        className={clsx(styles['search-city'])}
                        options={optionCity}
                        onChange={handleChangeCity}
                        defaultValue={'Tất cả thành phố'}
                    />
                    <Select
                        className={clsx(styles['search-tag'])}
                        maxTagCount="responsive"
                        options={optionTag}
                        mode="tags"
                        onChange={handleChangeTag}
                        allowClear
                    />
                    <Button onClick={handleSubmit} type="primary">
                        Tìm kiếm
                    </Button>
                </div>
                <div className={clsx(styles['home__search--tag'])}>
                    {optionTag.map((tag, index) => (
                        <Tag key={index} color="processing" onClick={() => handleClickTag(tag.value)}>
                            {tag.value}
                        </Tag>
                    ))}
                </div>
            </div>
            <div className={clsx(styles['result-search'])}>
                <Outlet />
            </div>
        </div>
    );
}

export default Home;
