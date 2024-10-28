import { Button, Col, Dropdown, Row } from 'antd';
import { UnorderedListOutlined, AccountBookOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
import styles from './LayoutDefaultUser.module.scss';
import clsx from 'clsx';
import './index.scss';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { deleteAllCookies, getCookie } from '../../cookies';
import { login, logout } from '../../action/login';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
const items = [
    {
        key: 1,
        label: (
            <div className={clsx(styles['notify__body-item'])}>
                <div className={clsx(styles['notify__body--icon'])}>
                    <AccountBookOutlined />
                </div>
                <div className={clsx(styles['notify__body--title'])}>Cài đặt thông tin cá nhân</div>
            </div>
        ),
    },
    {
        key: 2,
        label: (
            <div className={clsx(styles['notify__body-item'])}>
                <div className={clsx(styles['notify__body--icon'])}>
                    <EyeOutlined />
                </div>
                <div className={clsx(styles['notify__body--title'])}>Nhà tuyển dụng xem hồ sơ</div>
            </div>
        ),
    },
    {
        key: 3,
        label: (
            <div className={clsx(styles['notify__body-item'])}>
                <div className={clsx(styles['notify__body--icon'])}>
                    <LockOutlined />
                </div>
                <div className={clsx(styles['notify__body--title'])}>Đổi mật khẩu</div>
            </div>
        ),
    },
];
const itemsCollapse = [
    {
        key: '1',
        label: (
            <Button type="default">
                <Link to="/login">Đăng nhập</Link>
            </Button>
        ),
    },
    {
        key: '2',
        label: (
            <Button type="primary">
                <Link to="/register">Đăng kí</Link>
            </Button>
        ),
    },
];
function LayoutDefaultUser() {
    const isLogin = useSelector((state) => state.loginReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (getCookie('token')) {
            dispatch(login());
        }
    });
    const handleLogout = () => {
        deleteAllCookies();
        dispatch(logout());
        navigate('/');
    };
    const itemsCollapseLogin = [
        ...items,
        {
            key: 4,
            label: (
                <div onClick={handleLogout} className={clsx(styles['notify__body-item'])}>
                    <div className={clsx(styles['notify__body--icon'])}>
                        <LogoutOutlined />
                    </div>
                    <div className={clsx(styles['notify__body--title'])}>Đăng xuất</div>
                </div>
            ),
        },
    ];
    return (
        <div>
            <header className={clsx(styles['header'])}>
                <div className={clsx(styles['header__logo'])}>
                    <Link to="/">IT Jobs</Link>
                </div>
                <div className={clsx(styles['header__navbar'])}>
                    <Row>
                        <Col xxl={24} xl={24} lg={24} md={24} sm={0} xs={0}>
                            {isLogin ? (
                                <>
                                    <Button
                                        style={{ marginRight: '30px' }}
                                        onClick={handleLogout}
                                        icon={<LogoutOutlined />}
                                    >
                                        Đăng xuất
                                    </Button>
                                    <Dropdown
                                        trigger={['click']}
                                        menu={{ items }}
                                        dropdownRender={(menu) => (
                                            <div className={clsx(styles['notify'])}>
                                                <div className={clsx(styles['notify__header'])}>
                                                    <h4 className={clsx(styles['notify__header--fullname'])}>
                                                        {getCookie('fullname')}
                                                    </h4>
                                                    <p className={clsx(styles['notify__header--email'])}>
                                                        {getCookie('username')}
                                                    </p>
                                                </div>
                                                <div className={clsx(styles['notify__body'])}>{menu}</div>
                                            </div>
                                        )}
                                    >
                                        <Button
                                            htmlType="a"
                                            onClick={(e) => e.preventDefault()}
                                            icon={<UserOutlined />}
                                        ></Button>
                                    </Dropdown>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button type="default" className={clsx(styles['header__navbar--login'])}>
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button type="primary" className={clsx(styles['header__navbar--register'])}>
                                            Đăng kí
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </Col>
                        <Col xxl={0} xl={0} lg={0} md={0} sm={24} xs={24}>
                            {!isLogin ? (
                                <Dropdown
                                    placement="bottom"
                                    menu={{
                                        items: itemsCollapse,
                                    }}
                                    dropdownRender={(menu) => (
                                        <div className={clsx(styles['header__navbar-collapse'])}>{menu}</div>
                                    )}
                                >
                                    <Button
                                        htmlType="a"
                                        onClick={(e) => e.preventDefault()}
                                        icon={<UnorderedListOutlined />}
                                    ></Button>
                                </Dropdown>
                            ) : (
                                <Dropdown
                                    placement="bottom"
                                    menu={{
                                        items: itemsCollapseLogin,
                                    }}
                                    dropdownRender={(menu) => (
                                        <div className={clsx(styles['notify__body'])}>{menu}</div>
                                    )}
                                >
                                    <Button
                                        htmlType="a"
                                        onClick={(e) => e.preventDefault()}
                                        icon={<UnorderedListOutlined />}
                                    ></Button>
                                </Dropdown>
                            )}
                        </Col>
                    </Row>
                </div>
            </header>
            <>
                <Outlet />
            </>
        </div>
    );
}

export default LayoutDefaultUser;
