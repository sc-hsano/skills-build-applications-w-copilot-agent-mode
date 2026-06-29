import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';
import connectDB from '../config/database';

dotenv.config();

const seedDatabase = async () => {
  console.log('Seed the octofit_db database with test data');

  await connectDB();

  await Promise.all([
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    User.deleteMany({}),
    Team.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const teams = await Team.insertMany([
    {
      name: 'Trailblazers',
      motto: 'Every mile earns the next one.',
    },
    {
      name: 'Core Crushers',
      motto: 'Strong starts in the middle.',
    },
    {
      name: 'Cycle Squad',
      motto: 'Cadence, consistency, community.',
    },
  ]);

  const teamByName = new Map(teams.map((team) => [team.name, team]));

  const users = await User.insertMany([
    {
      username: 'maya-rivera',
      email: 'maya.rivera@example.com',
      displayName: 'Maya Rivera',
      teamId: teamByName.get('Trailblazers')?._id,
    },
    {
      username: 'liam-chen',
      email: 'liam.chen@example.com',
      displayName: 'Liam Chen',
      teamId: teamByName.get('Core Crushers')?._id,
    },
    {
      username: 'ava-patel',
      email: 'ava.patel@example.com',
      displayName: 'Ava Patel',
      teamId: teamByName.get('Cycle Squad')?._id,
    },
    {
      username: 'noah-kim',
      email: 'noah.kim@example.com',
      displayName: 'Noah Kim',
      teamId: teamByName.get('Trailblazers')?._id,
    },
  ]);

  const userByUsername = new Map(users.map((user) => [user.username, user]));

  await Activity.insertMany([
    {
      userId: userByUsername.get('maya-rivera')?._id,
      type: 'Trail Run',
      durationMinutes: 42,
      points: 210,
      completedAt: new Date('2026-06-24T13:30:00.000Z'),
    },
    {
      userId: userByUsername.get('liam-chen')?._id,
      type: 'Strength Training',
      durationMinutes: 50,
      points: 240,
      completedAt: new Date('2026-06-25T21:00:00.000Z'),
    },
    {
      userId: userByUsername.get('ava-patel')?._id,
      type: 'Indoor Cycling',
      durationMinutes: 45,
      points: 230,
      completedAt: new Date('2026-06-26T12:15:00.000Z'),
    },
    {
      userId: userByUsername.get('noah-kim')?._id,
      type: 'Recovery Yoga',
      durationMinutes: 30,
      points: 120,
      completedAt: new Date('2026-06-27T22:45:00.000Z'),
    },
    {
      userId: userByUsername.get('maya-rivera')?._id,
      type: 'Hill Intervals',
      durationMinutes: 35,
      points: 260,
      completedAt: new Date('2026-06-28T14:00:00.000Z'),
    },
  ]);

  await LeaderboardEntry.insertMany([
    {
      userId: userByUsername.get('maya-rivera')?._id,
      points: 470,
      rank: 1,
    },
    {
      userId: userByUsername.get('liam-chen')?._id,
      points: 240,
      rank: 2,
    },
    {
      userId: userByUsername.get('ava-patel')?._id,
      points: 230,
      rank: 3,
    },
    {
      userId: userByUsername.get('noah-kim')?._id,
      points: 120,
      rank: 4,
    },
  ]);

  await Workout.insertMany([
    {
      title: 'Morning Mobility Reset',
      description: 'A low-impact flow to loosen hips, shoulders, and ankles before the day starts.',
      difficulty: 'beginner',
      durationMinutes: 20,
    },
    {
      title: 'Tempo Run Builder',
      description: 'Warm up, hold a comfortably hard pace, then cool down with easy jogging.',
      difficulty: 'intermediate',
      durationMinutes: 40,
    },
    {
      title: 'Full-Body Strength Circuit',
      description: 'Squats, rows, presses, and core work arranged for steady conditioning.',
      difficulty: 'intermediate',
      durationMinutes: 45,
    },
    {
      title: 'Advanced Climb Intervals',
      description: 'Short high-resistance cycling climbs with controlled recovery blocks.',
      difficulty: 'advanced',
      durationMinutes: 55,
    },
  ]);

  console.log('Seed data created for users, teams, activities, leaderboard, and workouts.');
};

seedDatabase()
  .then(async () => {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  })
  .catch(async (error) => {
    console.error('Failed to seed octofit_db:', error);
    await mongoose.disconnect();
    process.exit(1);
  });