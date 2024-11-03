import {
    Button,
    Table,
    Tag,
    Popconfirm,
    Tooltip,
    message,
    Modal,
    Row,
    Form,
    Input,
    Grid,
    Col,
    Select,
    Switch,
} from 'antd';
import './index.scss';
import styles from './JobManage.module.scss';
import clsx from 'clsx';
import {
    FileAddOutlined,
    CheckCircleOutlined,
    MinusCircleOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { deleteJobById, getJobById, getJobByIdComapny, updateJobById } from '../../services/JobServices';
import { getCookie } from '../../cookies';
import { useNavigate } from 'react-router-dom';
import { getTags } from '../../services/TagServices';
const { useBreakpoint } = Grid;
function JobManage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [optionTag, setOptionTag] = useState([]);
    const screens = useBreakpoint();
    const [form] = Form.useForm();
    const [loadingModal, setLoadingModal] = useState(false);
    const deleteJob = async (id) => {
        setLoading(true);
        const res = await deleteJobById(id);
        if (res) {
            message.success('Bạn đã xóa thành công !');
            const newJobs = jobs.filter((job) => job.id !== id);
            setJobs(newJobs);
        } else {
            message.error('Xóa thất bại !');
        }
        setLoading(false);
    };
    const handleEdit = async (id) => {
        setOpenModal(true);
        const job = await getJobById(id);
        const { description, ...result } = job;
        form.setFieldsValue({
            ...result,
            ...description,
        });
    };
    const columns = useMemo(
        () => [
            {
                title: 'STT',
                dataIndex: 'index',
                fixed: 'left',
            },
            {
                title: 'Tên job',
                dataIndex: 'name',
                width: 120,
                fixed: 'left',
            },
            {
                title: 'Tags',
                dataIndex: 'tags',
                render: (tags) => (
                    <div className={clsx(styles.tags)}>
                        {tags.map((tag, index) => (
                            <Tag color="processing" key={`tag-${index}`} style={{ marginBottom: '5px' }}>
                                {tag}
                            </Tag>
                        ))}
                    </div>
                ),
                fixed: 'left',
            },
            {
                title: 'Mức lương ($)',
                dataIndex: 'salary',
                fixed: 'left',
            },
            {
                title: 'Thời gian',
                dataIndex: 'time',
                render: (time) => {
                    const { createAt, updateAt } = time;
                    return (
                        <div className={clsx(styles.time)}>
                            <Tooltip title={createAt.split(' ')[1]}>
                                <Tag color="success">{`Ngày lập ${createAt.split(' ')[0]}`}</Tag>
                            </Tooltip>
                            {updateAt ? (
                                <Tooltip title={updateAt.split(' ')[1]}>
                                    <Tag color="warning">{`Cập nhập ${updateAt.split(' ')[0]}`}</Tag>
                                </Tooltip>
                            ) : (
                                <></>
                            )}
                        </div>
                    );
                },
                fixed: 'left',
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                render: (status) => {
                    const element = status ? (
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                            Đăng bật
                        </Tag>
                    ) : (
                        <Tag color="default" icon={<MinusCircleOutlined />}>
                            Đăng tắt
                        </Tag>
                    );
                    return element;
                },
                fixed: 'left',
            },
            {
                title: 'Hành động',
                render: (_, row) => (
                    <div className={clsx(styles.action)}>
                        <Button icon={<EyeOutlined />}></Button>
                        <Button
                            onClick={() => {
                                handleEdit(row.id);
                            }}
                            type="primary"
                            icon={<EditOutlined />}
                        ></Button>
                        <Popconfirm
                            title={`Bạn có chắc muốn xóa job có stt là ${row.index}`}
                            onConfirm={() => deleteJob(row.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button icon={<DeleteOutlined />} danger></Button>
                        </Popconfirm>
                    </div>
                ),
                fixed: 'left',
            },
        ],
        [],
    );
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
    });
    const handleChange = (pagination) => {
        setPagination(pagination);
    };
    const handleSubmit = async (e) => {
        setLoadingModal(true);
        const { responsibilities, skills, benefits, ...result } = e;
        const description = { responsibilities, skills, benefits };
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear(); // Năm
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const formattedNow = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        const value = {
            ...result,
            ...description,
            updateAt: formattedNow,
        };
        const res = updateJobById(e.id, value);
        if (res) {
            let jobNow = {};
            message.success('Bạn đã cập nhập thành công !');
            const newJobs = jobs.filter((job) => {
                if (job.id === value.id) jobNow = job;
                return job.id !== value.id;
            });
            newJobs.splice(jobNow.index - 1, 0, {
                ...jobNow,
                ...value,
                time: {
                    ...jobNow.time,
                    updateAt: formattedNow,
                },
            });
            setJobs(newJobs);
        } else {
            message.error('Cập nhập thất bại !');
        }
        setLoadingModal(false);
        setOpenModal(false);
    };
    useEffect(() => {
        if (!getCookie('tokenCompany')) {
            navigate('/');
        } else {
            const fetchApi = async () => {
                const idCompany = parseInt(getCookie('id'));
                const allJobs = await getJobByIdComapny(idCompany);
                const allTags = await getTags();
                const dataOptionTag = allTags.map((tag) => ({
                    value: tag.name,
                    lable: tag.name,
                }));
                setOptionTag(dataOptionTag);
                const data = allJobs.map((job, index) => {
                    const time = { createAt: job.createAt, updateAt: job.updateAt || undefined };
                    const { createAt, updateAt, ...result } = job;
                    return { ...result, time, index: index + 1 };
                });
                setJobs(data);
            };
            fetchApi();
        }
    }, []);
    return (
        <div>
            <div className={clsx(styles['title'])}>Danh sách việc làm</div>
            <Button icon={<FileAddOutlined />} className={clsx(styles['button-create'])}>
                Tạo việc làm mới
            </Button>
            <Table
                loading={loading}
                total={jobs.length}
                pagination={pagination}
                onChange={handleChange}
                className={clsx(styles.table)}
                columns={columns}
                dataSource={jobs}
            />
            <Modal
                loading={loadingModal}
                title="Chỉnh sửa"
                centered
                onCancel={() => setOpenModal(false)}
                open={openModal}
                footer={null}
                className={clsx(screens.lg && styles['modal-edit'], !screens.lg && styles['modal-edit--responsive'])}
            >
                <Form onFinish={handleSubmit} layout="vertical" form={form}>
                    <Row gutter={[20, 0]}>
                        <Form.Item
                            hidden="true"
                            name="id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vào tên job !',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Col span={24}>
                            <Form.Item
                                label="Tên job"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào tên job !',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                            <Form.Item
                                label="Tags"
                                name="tags"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào các tags !',
                                    },
                                ]}
                            >
                                <Select mode="multiple" options={optionTag} placeholder="Tags language" allowClear />
                            </Form.Item>
                        </Col>
                        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                            <Form.Item
                                label="Mức lương"
                                name="salary"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào mức lương !',
                                    },
                                    {
                                        pattern: /^[1-9][0-9]*-[1-9][0-9]*$/,
                                        message: 'Vui lòng nhập lại VD : 1000-1500 !',
                                    },
                                ]}
                            >
                                <Input addonAfter="$" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Trách nhiệm"
                                name="responsibilities"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào !',
                                    },
                                ]}
                            >
                                <Select mode="tags" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Kỹ năng"
                                name="skills"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào !',
                                    },
                                ]}
                            >
                                <Select mode="tags" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Quyền lợi"
                                name="benefits"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vào !',
                                    },
                                ]}
                            >
                                <Select mode="tags" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Trạng thái" name="status">
                                <Switch checkedChildren="Đã bật" unCheckedChildren="Đã tắt" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Cập nhập
                                </Button>
                                <Button
                                    style={{ marginLeft: '1rem' }}
                                    htmlType="submit"
                                    onClick={() => setOpenModal(false)}
                                >
                                    Hủy
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}

export default JobManage;
