import fs from 'fs/promises';
import path from 'path';
import { NavigationInfo } from '../types';

export async function readTaskData(taskId: string): Promise<NavigationInfo[]> {
  try {
    const filePath = path.join(__dirname, `../../data/tasks/task_${taskId}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取任务数据失败 (${taskId}):`, error);
    throw new Error('任务数据不存在');
  }

} 