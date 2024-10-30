import { Button, Layout, Grid, Menu } from 'antd';
import styles from './Admin.module.scss';
import clsx from 'clsx';
import {
    MenuFoldOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UserOutlined,
    UnorderedListOutlined,
    SolutionOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { deleteAllCookies, getCookie } from '../../cookies';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../action/login';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
const { useBreakpoint } = Grid;
const { Sider, Content } = Layout;
const items = [
    {
        key: 'sub1',
        label: <Link to="/admin">Tổng quan</Link>,
        icon: <DashboardOutlined />,
    },
    {
        key: 'sub2',
        label: <Link to="/admin/infor">Thông tin công ty</Link>,
        icon: <UserOutlined />,
    },
    {
        key: 'sub3',
        label: <Link>Quản lý việc làm</Link>,
        icon: <UnorderedListOutlined />,
    },
    {
        key: 'sub4',
        label: <Link>Quản lý CV</Link>,
        icon: <SolutionOutlined />,
    },
];
function Admin() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const screens = useBreakpoint();
    const handleCollapse = () => {
        setCollapsed(!collapsed);
    };
    const handleLogout = () => {
        deleteAllCookies();
        dispatch(logout());
        navigate('/');
    };
    useEffect(() => {
        if (!getCookie('tokenCompany')) {
            navigate('/');
        }
    }, []);
    return (
        <Layout style={{ display: 'flex' }}>
            <header className={clsx(styles.header)}>
                <div
                    className={clsx(
                        styles['header__logo'],
                        collapsed && styles['header__logo--collapse'],
                        !screens.lg && collapsed && styles['header__logo--responsive'],
                        !screens.lg && !collapsed && styles['header__logo--responsiveWidth'],
                    )}
                >
                    IT Admin
                </div>
                <div className={clsx(styles['header__menu'])}>
                    <div
                        className={clsx(
                            styles['header__collapse'],
                            !screens.lg && !collapsed && styles['header__collapse--responsive'],
                        )}
                    >
                        <Button onClick={handleCollapse} type="text" shape="circle">
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </Button>
                    </div>
                    <div className={clsx(styles['header__logout'])}>
                        <Button onClick={handleLogout} icon={<LogoutOutlined />}>
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            </header>
            <Layout>
                <Sider
                    width={screens.lg ? '200' : '160'}
                    collapsedWidth={screens.lg ? '80' : '0'}
                    collapsed={collapsed}
                    className={clsx(styles.sider, !screens.lg && styles['sider--responsive'])}
                >
                    <Menu defaultSelectedKeys={['sub1']} items={items} />
                </Sider>
                <Content className={clsx(styles.content)}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
export default Admin;
