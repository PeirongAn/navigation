import { Request, Response } from 'express';
import { Rating } from '../models/Rating';

export const createRating = async (req: Request, res: Response) => {
  try {
    const { 
      timestamp,
      taskId,
      userId,
      confidenceScore,
      difficultyScore,
      timingScore,
      contentScore,
      interactionScore,
      locationScore,
      comment 
    } = req.body;
    
    const newRating = await Rating.create({
      timestamp,
      taskId,
      userId,
      confidenceScore,
      difficultyScore,
      timingScore,
      contentScore,
      interactionScore,
      locationScore,
      comment
    });
    
    res.status(201).json({
      success: true,
      data: newRating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '保存评价失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
};

export const getRatings = async (req: Request, res: Response) => {
  try {
    const ratings = await Rating.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: ratings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取评价失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
}; 