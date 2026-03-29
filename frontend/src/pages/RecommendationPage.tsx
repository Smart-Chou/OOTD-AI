import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Empty, Spin, message } from 'antd';
import { BulbOutlined, StarOutlined } from '@ant-design/icons';
import { useBodyDataStore, useWardrobeStore } from '../stores';

const { Title, Paragraph } = Typography;

const RecommendationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { bodyData } = useBodyDataStore();
  const { clothing } = useWardrobeStore();

  const handleGenerate = () => {
    if (!bodyData) {
      message.warning('请先完善体型数据');
      return;
    }
    if (clothing.length === 0) {
      message.warning('请先添加衣物到衣橱');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success('推荐生成成功');
    }, 2000);
  };

  if (!bodyData) {
    return (
      <div>
        <Title level={2}>智能推荐</Title>
        <Card>
          <Empty description="请先完善体型数据">
            <Button type="primary" href="/body-data">去填写</Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>智能推荐</Title>
      <Paragraph>基于您的体型数据和衣物库生成个性化穿搭推荐</Paragraph>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <p><strong>身高:</strong> {bodyData.height}cm</p>
            <p><strong>体重:</strong> {bodyData.weight}kg</p>
          </Col>
          <Col span={12}>
            <p><strong>腰围:</strong> {bodyData.waist}cm</p>
            <p><strong>臀围:</strong> {bodyData.hips}cm</p>
          </Col>
        </Row>
      </Card>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Button type="primary" size="large" icon={<BulbOutlined />} onClick={handleGenerate} loading={loading}>
          生成推荐搭配
        </Button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
          <p>AI正在分析您的数据...</p>
        </div>
      )}

      {!loading && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={
                <div style={{ height: 200, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BulbOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </div>
              }
            >
              <Card.Meta
                title="休闲日常搭配"
                description="适合日常出行的舒适穿搭"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={
                <div style={{ height: 200, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BulbOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </div>
              }
            >
              <Card.Meta
                title="工作日正式穿搭"
                description="专业得体的职场装扮"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={
                <div style={{ height: 200, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BulbOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </div>
              }
            >
              <Card.Meta
                title="周末约会搭配"
                description="轻松浪漫的约会穿搭"
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default RecommendationPage;
