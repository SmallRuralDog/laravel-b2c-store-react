import request from '@/utils/request';

export async function getGoodsList(params) {
  return request('goodsList', { method: 'POST', body: params });
}

export async function getGoodsAttr() {
  return request('goodsAttr');
}

export async function createGoodsAttr(params: object) {
  return request('createGoodsAttr', { method: 'POST', body: params });
}

export async function createGoodsAttrValue(params: object) {
  return request('createGoodsAttrValue', { method: 'POST', body: params });
}

export async function editGoodsBase(params: object) {
  return request('editGoodsBase', { method: 'POST', body: params });
}

export async function saveGoods(params: object) {
  return request('saveGoods', { method: 'POST', body: params });
}
