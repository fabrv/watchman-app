export type collections =
  'projects'
  | 'teams'
  | 'log-types'
  | 'roles'
  | 'time-logs'
  | 'users'
  | 'session'

export interface Model {
  id: string | number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Project extends Model {}
export interface Team extends Model {}
export interface LogType extends Model {}
export interface Role extends Model {}

export interface TimeLog {
  id: number;
  user_id: number;
  log_type_id: number;
  project_id: number;
  team_id: number;
  start_time: string;
  end_time: string;
  description: string;
  finished: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface ErrorResponse {
  error: string;
}

export interface MessageResponse {
  message: string;
}
