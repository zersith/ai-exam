import { api } from './client';

export interface UserInfo {
  userId: number;
  name: string;
}

export async function login(name: string): Promise<UserInfo> {
  return api.post<UserInfo>('/login', { name });
}
