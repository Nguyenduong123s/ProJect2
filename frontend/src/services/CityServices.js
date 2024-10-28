import { get } from '../untils/request';
export const getCity = async () => {
    const res = await get('citys');
    return res;
};
