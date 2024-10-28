import { get, post } from '../untils/request';
export const checkEmail = async (email) => {
    const res = await get('users');
    const check = res.some((user) => user.username == email);
    return check;
};
export const postUser = async (value) => {
    const res = post('users', value);
    return res;
};
