import request from '@/utils/request';

export async function getList(params) {
  return request('mediaList', { method: 'POST', body: { ...params } });
}

export async function delMedia(params) {
  return request('delMedia', { method: 'POST', body: { ...params } });
}

export async function createMediaCategoryList(params) {
  return request('createMediaCategoryList', { method: 'POST', body: { ...params } });
}

export async function getMediaCategoryList(params) {
  return request('getMediaCategoryList', { method: 'POST', body: { ...params } });
}

