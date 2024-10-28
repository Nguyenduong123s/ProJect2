import { get } from '../untils/request';
export const getTags = async () => {
    const res = await get('tags');
    return res;
};
