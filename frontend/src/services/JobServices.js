import { del, get, update } from '../untils/request';
export const getJobs = async () => {
    const res = await get('jobs');
    return res;
};
export const getJobById = async (id) => {
    const res = await get('jobs');
    const result = res.find((res) => res.id === id);
    return result;
};
export const getJobByIdComapny = async (id) => {
    const res = await get('jobs');
    const result = res.filter((res) => res.idCompany === id);
    return result;
};
export const getTotalJob = async (idCompany) => {
    const res = await get('jobs');
    const jobs = res.filter((job) => job.idCompany === idCompany);
    const jobOn = jobs.reduce((total, job) => (job.status ? total + 1 : total), 0);
    return {
        totalJob: jobs.length,
        jobOn,
        jobOff: jobs.length - jobOn,
    };
};
export const deleteJobById = async (id) => {
    const res = await del('jobs', id);
    return res;
};
export const updateJobById = async (id, value) => {
    const res = await update('jobs', id, value);
    return res;
};
