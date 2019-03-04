import request from '@/utils/request';

export async function query() {
  return request('users');
}

export async function queryCurrent(params) {
  return request('currentUser', { method: 'POST', body: params });
}
