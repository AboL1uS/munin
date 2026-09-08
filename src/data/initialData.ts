import { LearningTrack, TopicGroup, UserProfile } from '../types';

export const INITIAL_TOPICS: TopicGroup[] = [];

export const INITIAL_TRACKS: LearningTrack[] = [];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Студент',
  role: 'Разработчик',
  avatar: null,
  joinedAt: Date.now(),
};


