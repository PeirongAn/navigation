import express from 'express';

const router = express.Router();

router.get('/tasks/:taskId/description', async (req, res) => {
  try {
    const { taskId } = req.params;
    res.json({ description: `任务${taskId}的描述` });
  } catch (error) {
    res.status(404).json({ error: '任务不存在' });
  }
});

export const navigationRouter = router; 