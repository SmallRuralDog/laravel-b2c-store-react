import { delMedia, getList, getMediaCategoryList } from '@/services/media';
import * as _ from 'lodash';

export default {
  state: {
    visible: false,// 是否显示
    callBack: null,
    max: 0,
    selected: [],
    list: [],// 列表数据
    meta: {},
    query: {
      mc_id:0,
      type:'image'
    },
    categoryList: [],
  },
  effects: {
    // 显示弹窗并加载列表数据
    * show({ payload }, { call, put, select }) {
      yield put({ type: 'setShow', payload: payload });
      const media: Models.IMediaStore = yield select(state => state.media);
      if (media.list.length <= 0) {
        yield put({
          type: 'getList',
        });
        yield put({
          type: 'getCategoryList',
        });
      }
    },
    /**
     * 数据分页
     * @param param0
     * @param param1
     */
    * pageChange({ payload: { page } }, { call, put, select }) {
      const media: Models.IMediaStore = yield select(state => state.media);
      if (page !== media.meta.current_page && page > 0) {
        const selfMeta = _.clone(media.meta);
        selfMeta.current_page = page;
        yield put({
          type: 'setState',
          payload: {
            meta: selfMeta,
          },
        });
        yield put({
          type: 'getList',
        });
      }
    },
    // 加载数据
    * getList(_, { call, put, select }) {
      const media: Models.IMediaStore = yield select(state => state.media);
      const params = {
        page: media.meta.current_page || 1,
        query: media.query,
      };
      const response = yield call(getList, params);
      yield put({
        type: 'setList',
        payload: response,
      });
    },
    // 删除媒体
    * delMedia({ payload }, { call, put }) {
      const params = {
        ...payload,
      };
      const response = yield call(delMedia, params);
      if (response.code === 200) {
        yield put({
          type: 'getList',
        });
      }
    },
    * getCategoryList(_, { call, put, select }) {
      const media: Models.IMediaStore = yield select(state => state.media);
      const params = {
        type: media.query.type || 'image',
      };
      const response = yield call(getMediaCategoryList, params);
      yield put({
        type: 'setState',
        payload: {
          categoryList: response.data,
        },
      });
    },
  },
  reducers: {
    /**
     * 设置数据
     * @param state
     * @param action
     */
    setState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    // 设置弹窗显示
    setShow(state, action) {
      return {
        ...state,
        selected: action.payload.selected || [],
        max: action.payload.max || 0,
        callBack: action.payload.callBack,
        visible: true,
      };
    },
    // 隐藏弹窗
    hide(state, action) {
      return {
        ...state,
        visible: false,
      };
    },
    // 设置列表数据
    setList(state, action) {
      const { data, meta } = action.payload.data;
      return {
        ...state,
        list: data,
        meta: meta,
      };
    },
  },
};
