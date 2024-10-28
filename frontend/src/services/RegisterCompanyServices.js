import { get, post } from '../untils/request';
export const checkEmailCompany = async (email) => {
    const res = await get('companys');
    const check = res.some((user) => user.username == email);
    return check;
};
export const postUserCompany = async (value) => {
    const res = post('companys', value);
    return res;
};
