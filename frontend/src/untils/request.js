const API_DOMAIN = 'http://localhost:3500/';

export const get = async (path) => {
    const res = await fetch(API_DOMAIN + path);
    const result = await res.json();
    return result;
};

export const post = async (path, value) => {
    const option = {
        method: 'POST', // Phương thức HTTP POST
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
    };
    const res = await fetch(API_DOMAIN + path, option);
    const result = await res.json();
    return result;
};

export const del = async (path, id = '') => {
    const option = {
        method: 'DELETE', // Phương thức HTTP DELETE
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const res = await fetch(API_DOMAIN + path + `/${id}`, option);
    const result = await res.json();
    if (res) {
        return result;
    } else {
        console.log('Delete is fail');
    }
};

export const update = async (path, id = '', value) => {
    const option = {
        method: 'PATCH', // Phương thức HTTP DELETE
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
    };
    const res = await fetch(API_DOMAIN + path + `/${id}`, option);
    const result = await res.json();
    return result;
};
