import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';
import connectDB from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${PORT}`;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'OctoFit Tracker API is running',
    apiBaseUrl,
  });
});

app.get('/api/users/', async (req, res, next) => {
  try {
    const users = await User.find().sort({ displayName: 1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

app.post('/api/users/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.get('/api/teams/', async (req, res, next) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
});

app.post('/api/teams/', async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
});

app.get('/api/activities/', async (req, res, next) => {
  try {
    const activities = await Activity.find().sort({ completedAt: -1 }).populate('userId');
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
});

app.post('/api/activities/', async (req, res, next) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
});

app.get('/api/leaderboard/', async (req, res, next) => {
  try {
    const leaderboard = await LeaderboardEntry.find().sort({ rank: 1 }).populate('userId');
    res.status(200).json(leaderboard);
  } catch (error) {
    next(error);
  }
});

app.post('/api/leaderboard/', async (req, res, next) => {
  try {
    const entry = await LeaderboardEntry.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

app.get('/api/workouts/', async (req, res, next) => {
  try {
    const workouts = await Workout.find().sort({ difficulty: 1, title: 1 });
    res.status(200).json(workouts);
  } catch (error) {
    next(error);
  }
});

app.post('/api/workouts/', async (req, res, next) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API base URL: ${apiBaseUrl}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
