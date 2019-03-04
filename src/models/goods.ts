import { getGoodsList, getGoodsAttr, saveGoods } from "@/services/goods";
import _ from 'lodash';
export default {
    state: {
        list: [],
        meta: {},
        query: {},
        sorter: {},
        skus: [],
    },
    effects: {
        *showGoodsList(action: IEffectsAction, { call, put, select }) {
            const { list } = yield select((store: IStores) => store.goods)
            if (list.length <= 0) {
                yield put({
                    type: 'getGoodsList'
                })
            }
        },
        *listPageChange(action: IEffectsAction, { call, put, select }) {
            const { payload: { page } } = action
            const goods: Models.IGoodsStore = yield select(state => state.goods);
            if (page !== goods.meta.current_page && page > 0) {
                const selfMeta = _.clone(goods.meta);
                selfMeta.current_page = page
                yield put({
                    type: 'setState',
                    payload: {
                        meta: selfMeta
                    }
                })
                yield put({
                    type: 'getGoodsList'
                })
            }
        },
        *listSorterChange(action: IEffectsAction, { call, put, select }) {
            const { payload } = action
            const goods: Models.IGoodsStore = yield select(state => state.goods);
            const selfSorter = _.clone(goods.sorter);
            selfSorter.field = payload.field
            selfSorter.order = payload.order
            yield put({
                type: 'setState',
                payload: {
                    sorter: selfSorter
                }
            })
            yield put({
                type: 'getGoodsList'
            })
        },
        *getGoodsList(action: IEffectsAction, { call, put, select }) {
            const { callback } = action
            const goods: Models.IGoodsStore = yield select(state => state.goods);
            const params = {
                page: goods.meta.current_page || 1,
                query: goods.query,
                sorter: goods.sorter
            };
            const response = yield call(getGoodsList, params)
            yield put({
                type: 'setGoodsList',
                payload: response,
            });
            callback && callback(response)

        },
        *getGoodsAttr({ plyload }, { call, put }) {
            const response = yield call(getGoodsAttr, plyload)
            yield put({
                type: 'setState',
                payload: {
                    skus: response.data
                }
            })
        },
        *saveGoods(action: IEffectsAction, { call, put }) {
            const { payload, callback } = action;
            const res: Models.IResponse = yield call(saveGoods, payload);
            if (res && res.code === 200) {
                callback && callback(res);
                yield put({
                    type: 'getGoodsList'
                })
            }
        }
    },
    reducers: {
        // 设置数据
        setState(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        setGoodsList(state, action) {
            const { data, meta } = action.payload.data
            return {
                ...state,
                list: data,
                meta: meta
            }
        }
    }
}
