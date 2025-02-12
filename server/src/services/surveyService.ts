import { Database } from 'sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

// 创建表结构
db.run(`
  CREATE TABLE IF NOT EXISTS user_survey_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    task_id TEXT NOT NULL,
    step_index INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    confidence INTEGER NOT NULL,
    overall_feedback TEXT,
    record_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

interface SurveyData {
  username: string;
  taskId: string;
  stepIndex: number;
  rating: number;
  confidence: number;
  overallFeedback?: string;
  recordPath?: string;
}

export const surveyService = {
  async addSurveyRecord(data: SurveyData): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO user_survey_records 
        (username, task_id, step_index, rating, confidence, overall_feedback, record_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(sql, [
        data.username,
        data.taskId,
        data.stepIndex,
        data.rating,
        data.confidence,
        data.overallFeedback || null,
        data.recordPath || null
      ], (err: unknown) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}; 