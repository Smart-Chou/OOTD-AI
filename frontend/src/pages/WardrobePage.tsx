import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Row, Col, Typography, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { wardrobeApi } from '../services/api';
import { useWardrobeStore } from '../stores';
import { useMessage } from '../hooks/useMessage';
import type { ClothingItem, ClothingCategory } from '../types';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const categories: { value: ClothingCategory; label: string }[] = [
  { value: 'tops', label: '上衣' },
  { value: 'bottoms', label: '下装' },
  { value: 'outerwear', label: '外套' },
  { value: 'dresses', label: '连衣裙' },
  { value: 'shoes', label: '鞋子' },
  { value: 'accessories', label: '配饰' },
];

const WardrobePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [form] = Form.useForm();
  const { clothing, setClothing, addClothing, updateClothing, removeClothing } = useWardrobeStore();
  const message = useMessage();

  useEffect(() => {
    loadClothing();
  }, []);

  const loadClothing = async () => {
    setLoading(true);
    try {
      const response = await wardrobeApi.getClothingList();
      setClothing(response.data);
    } catch (error) {
      message.error('加载衣物失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingItem) {
        const response = await wardrobeApi.updateClothing(editingItem.id, values);
        updateClothing(editingItem.id, response.data);
        message.success('衣物更新成功');
      } else {
        const response = await wardrobeApi.createClothing(values);
        addClothing(response.data);
        message.success('衣物添加成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingItem(null);
    } catch (error: any) {
      message.error(error.response?.data?.detail || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await wardrobeApi.deleteClothing(id);
      removeClothing(id);
      message.success('衣物删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: ClothingCategory) => {
        const cat = categories.find(c => c.value === category);
        return <Tag color="blue">{cat?.label || category}</Tag>;
      }
    },
    { title: '颜色', dataIndex: 'color', key: 'color' },
    { title: '品牌', dataIndex: 'brand', key: 'brand' },
    { title: '尺码', dataIndex: 'size', key: 'size' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ClothingItem) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => {
            setEditingItem(record);
            form.setFieldsValue(record);
            setModalVisible(true);
          }} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>衣橱管理</Title>
          <Paragraph>管理您的衣物库</Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingItem(null);
          form.resetFields();
          setModalVisible(true);
        }}>
          添加衣物
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={clothing}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingItem ? '编辑衣物' : '添加衣物'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="衣物名称" />
          </Form.Item>
          <Form.Item label="类别" name="category" rules={[{ required: true, message: '请选择类别' }]}>
            <Select placeholder="请选择类别">
              {categories.map(cat => (
                <Option key={cat.value} value={cat.value}>{cat.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="颜色" name="color">
                <Input placeholder="颜色" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="品牌" name="brand">
                <Input placeholder="品牌" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="尺码" name="size">
                <Input placeholder="尺码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="季节" name="season">
                <Select placeholder="请选择">
                  <Option value="spring">春季</Option>
                  <Option value="summer">夏季</Option>
                  <Option value="fall">秋季</Option>
                  <Option value="winter">冬季</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {editingItem ? '更新' : '添加'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WardrobePage;
