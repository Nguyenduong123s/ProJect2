import LayoutDefaultUser from '../layout/LayoutDefaultUser';
import Home from '../page/Home';
import Search from '../page/Search';
import Login from '../page/Login';
import Register from '../page/Register';
import DetailJob from '../page/DetailJob';
import Admin from '../page/Admin';
import Dashboard from '../page/Dashboard';

const routes = [
    {
        path: '/',
        element: <LayoutDefaultUser />,
        children: [
            {
                path: '/',
                element: <Home />,
                children: [
                    {
                        path: '/search',
                        element: <Search />,
                    },
                ],
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/detail-job/:id',
                element: <DetailJob />,
            },
        ],
    },
    {
        path: '/admin',
        element: <Admin />,
        children: [
            {
                path: '/admin',
                element: <Dashboard />,
            },
        ],
    },
];
export default routes;
