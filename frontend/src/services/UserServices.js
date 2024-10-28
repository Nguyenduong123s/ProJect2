import { get } from '../untils/request';
export const checkLogin = async (username, password) => {
    const res = await get('users');
    const check = res.find((user) => user.username == username);
    if (!check) {
        return {
            username: false,
        };
    } else {
        if (check.password == password) {
            return {
                username: true,
                password: true,
                user: check,
            };
        } else {
            return {
                username: true,
                password: false,
            };
        }
    }
};
