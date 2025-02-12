import { WebSocket } from 'ws';
import { readTaskData } from '../services/taskService';
import { NavigationInfo } from '../types';

export async function handleTaskStart(ws: WebSocket, payload: string) {
  try {
    const taskId  = payload;
    const taskData = await readTaskData(taskId);
    
    // 模拟任务执行过程
    for (const info of taskData) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 每2秒发送一条导航信息
      ws.send(JSON.stringify({
        type: 'navigation',
        payload: info
      }));
    }

    // 任务完成
    // ws.send(JSON.stringify({
    //   type: 'finish',
    // }));
  } catch (error) {
    console.error('处理任务时出错:', error);
    ws.send(JSON.stringify({
      type: 'error',
      payload: '任务执行失败'
    }));
  }
} 