import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Typography } from 'antd';
import { UserOutlined, ShopOutlined, ScissorOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const features = [
    { icon: <UserOutlined />, title: '体型分析', desc: '基于身高体重数据分析您的体型特征' },
    { icon: <ShopOutlined />, title: '智能衣橱', desc: '管理您的衣物库，按类别分类整理' },
    { icon: <ScissorOutlined />, title: '搭配推荐', desc: 'AI智能推荐适合您的穿搭方案' },
    { icon: <RocketOutlined />, title: '效果预览', desc: '生成AI穿搭效果图,预览上身效果' },
  ];

  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <Title level={1} style={{ marginBottom: 16 }}>OOTD AI</Title>
      <Paragraph style={{ fontSize: 18, color: '#666', marginBottom: 48 }}>
        智能穿搭助手，让搭配更简单
      </Paragraph>

      <Row gutter={[24, 24]} justify="center" style={{ maxWidth: 1000, margin: '0 auto' }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card hoverable style={{ height: '100%' }}>
              <div style={{ fontSize: 40, marginBottom: 16, color: '#1890ff' }}>{feature.icon}</div>
              <Title level={4}>{feature.title}</Title>
              <Paragraph type="secondary">{feature.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 48 }}>
        <Link to="/register">
          <Button type="primary" size="large">开始使用</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
