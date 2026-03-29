import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Row, Col, Typography, Tag, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { outfitApi, wardrobeApi } from '../services/api';
import { useOutfitStore, useWardrobeStore } from '../stores';
import type { Outfit, ClothingItem } from '../types';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const occasions = [
  { value: 'casual', label: '休闲' },
  { value: 'formal', label: '正式' },
  { value: 'work', label: '工作' },
  { value: 'date', label: '约会' },
  { value: 'sport', label: '运动' },
];

const OutfitsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);
  const [viewingOutfit, setViewingOutfit] = useState<Outfit | null>(null);
  const [allClothing, setAllClothing] = useState<ClothingItem[]>([]);
  const [form] = Form.useForm();
  const { outfits, setOutfits, addOutfit, updateOutfit, removeOutfit } = useOutfitStore();

  useEffect(() => {
    loadOutfits();
    loadClothing();
  }, []);

  const loadOutfits = async () => {
    setLoading(true);
    try {
      const response = await outfitApi.getOutfits();
      setOutfits(response.data);
    } catch (error) {
      message.error('加载搭配失败');
    } finally {
      setLoading(false);
    }
  };

  const loadClothing = async () => {
    try {
      const response = await wardrobeApi.getClothingList();
      setAllClothing(response.data);
    } catch (error) {
      console.error('加载衣物失败');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingOutfit) {
        const response = await outfitApi.updateOutfit(editingOutfit.id, values);
        updateOutfit(editingOutfit.id, response.data);
        message.success('搭配更新成功');
      } else {
        const response = await outfitApi.createOutfit(values);
        addOutfit(response.data);
        message.success('搭配创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingOutfit(null);
    } catch (error: any) {
      message.error(error.response?.data?.detail || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await outfitApi.deleteOutfit(id);
      removeOutfit(id);
      message.success('搭配删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleView = async (outfit: Outfit) => {
    try {
      const response = await outfitApi.getOutfit(outfit.id);
      setViewingOutfit(response.data);
      setViewModalVisible(true);
    } catch (error) {
      message.error('加载失败');
    }
  };

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '场合',
      dataIndex: 'occasion',
      key: 'occasion',
      render: (occasion: string) => {
        const occ = occasions.find(o => o.value === occasion);
        return <Tag>{occ?.label || occasion}</Tag>;
      }
    },
    {
      title: '公开',
      dataIndex: 'is_public',
      key: 'is_public',
      render: (isPublic: number) => <Tag color={isPublic ? 'green' : 'default'}>{isPublic ? '公开' : '私有'}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Outfit) => (
        <>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="link" icon={<EditOutlined />} onClick={() => {
            setEditingOutfit(record);
            form.setFieldsValue({ ...record, item_ids: record.items.map(i => i.id) });
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
          <Title level={2}>搭配方案</Title>
          <Paragraph>创建和管理您的穿搭方案</Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingOutfit(null);
          form.resetFields();
          setModalVisible(true);
        }}>
          创建搭配
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={outfits}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingOutfit ? '编辑搭配' : '创建搭配'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingOutfit(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="搭配名称" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} placeholder="搭配描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="场合" name="occasion">
                <Select placeholder="请选择场合">
                  {occasions.map(occ => (
                    <Option key={occ.value} value={occ.value}>{occ.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="季节" name="season">
                <Select placeholder="请选择季节">
                  <Option value="spring">春季</Option>
                  <Option value="summer">夏季</Option>
                  <Option value="fall">秋季</Option>
                  <Option value="winter">冬季</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="选择衣物" name="item_ids" rules={[{ required: true, message: '请选择至少一件衣物' }]}>
            <Select mode="multiple" placeholder="选择衣物">
              {allClothing.map(item => (
                <Option key={item.id} value={item.id}>{item.name} - {item.category}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="公开" name="is_public" valuePropName="checked">
            <Switch checkedChildren="公开" unCheckedChildren="私有" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {editingOutfit ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={viewingOutfit?.name}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        <p><strong>描述:</strong> {viewingOutfit?.description}</p>
        <p><strong>场合:</strong> {viewingOutfit?.occasion}</p>
        <p><strong>季节:</strong> {viewingOutfit?.season}</p>
        <div style={{ marginTop: 16 }}>
          <strong>包含衣物:</strong>
          <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
            {viewingOutfit?.items.map(item => (
              <Col xs={12} sm={8} key={item.id}>
                <Card size="small">{item.name}</Card>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default OutfitsPage;
