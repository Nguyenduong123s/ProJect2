import { post } from '../untils/request';
export const postCV = async (value) => {
    const res = await post('cvs', value);
    return res;
};
