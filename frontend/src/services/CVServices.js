import { post, get } from '../untils/request';
export const postCV = async (value) => {
    const res = await post('cvs', value);
    return res;
};
export const getTotalCV = async (idCompany) => {
    const res = await get('cvs');
    const cvs = res.filter((cv) => cv.idCompany === idCompany);
    const cvOn = cvs.reduce((total, cv) => (cv.statusRead ? total + 1 : total), 0);
    return {
        totalCv: cvs.length,
        cvOn,
        cvOff: cvs.length - cvOn,
    };
};
