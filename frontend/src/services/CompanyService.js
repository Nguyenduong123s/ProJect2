import { get } from '../untils/request';
export const getCompanyById = async (id) => {
    const res = await get('companys');
    const result = res.find((res) => res.id == id);
    return result;
};
export const checkLoginCompany = async (email, password) => {
    const res = await get('companys');
    const check = res.find((company) => company.email == email);
    if (!check) {
        return {
            email: false,
        };
    } else {
        if (check.password == password) {
            return {
                email: true,
                password: true,
                user: check,
            };
        } else {
            return {
                email: true,
                password: false,
            };
        }
    }
};
