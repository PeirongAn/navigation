import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import cors from 'cors';
import { setupWebSocket } from './websocket';
import { navigationRouter } from './routes/navigation';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ 
  server,
  path: '/ws/client1'  // WebSocket 路径
});

// 中间件
app.use(cors({
  origin: '*',  // 允许所有来源访问
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 路由
app.use('/api/navigation', navigationRouter);

// WebSocket设置
setupWebSocket(wss);

// 启动服务器，监听所有网络接口
const PORT = Number(process.env.PORT) || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`WebSocket 服务运行在 ws://0.0.0.0:${PORT}/ws`);
});

export { app, server }; 