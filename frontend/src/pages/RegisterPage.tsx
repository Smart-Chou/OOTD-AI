import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuthStore } from '../stores';
import { useMessage } from '../hooks/useMessage';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const message = useMessage();

  const onFinish = async (values: { email: string; username: string; password: string; full_name?: string }) => {
    setLoading(true);
    try {
      const response = await authApi.register(values);
      const user = response.data;

      // Auto login after register
      const loginFormData = new URLSearchParams();
      loginFormData.append('username', values.username);
      loginFormData.append('password', values.password);

      const loginResponse = await authApi.login(loginFormData.toString());
      const { access_token } = loginResponse.data;

      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(user);

      message.success('注册成功');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || '注册失败';
      message.error(typeof errorMsg === 'string' ? errorMsg : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center' }}>注册</Title>
        <Form name="register" onFinish={onFinish} size="large">
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}>
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item name="username" rules={[{ required: true, min: 3, message: '用户名至少3个字符' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, min: 6, message: '密码至少6个字符' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item name="full_name" rules={[{ required: false }]}>
            <Input placeholder="姓名（可选）" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          已有账号？ <a href="/login">立即登录</a>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
