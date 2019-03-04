declare namespace Models {
  type dispatch = (object: { type: string, payload?: object, callback?: (res: IResponse) => void }) => void

  interface IResponse {
    code: number;
    data: any;
    status: string;
  }

  /**
   *
   * 产品模块数据
   * @interface IGoodsStore
   */
  interface IGoodsStore {
    // 产品列表
    list: IGoods[];
    // 产品列表分页
    meta: IMeta;
    // 产品列表查询数据
    query: any;
    sorter: {
      order: 'ascend' | 'descend';
      field: string;
    }
    /**
     *
     * 店铺sku配置
     * @type {ISku[]}
     * @memberof IGoodsStore
     */
    skus: ISku[];
  }

  interface IMediaStore {
    /**
     * 是否显示弹窗
     */
    visible: boolean;
    /**
     * 最大选择数量
     */
    max: number;
    /**
     * 已选择列表
     */
    selected: IMedia[];
    /**
     * 选择回调
     */
    callBack: (res: IMedia[]) => void;
    /**
     * 媒体列表数据
     */
    list: IMedia[];

    meta: IMeta;
    query: {
      mc_id: number;
      type: 'image' | 'video'
    };
    categoryList: any[]
  }

  interface IGlobalStore {
    store: any
  }


  interface IGoods {
    id: string;
    name: string;
    cover: IMedia,
    medias: IMedia[],
    price: number;
    line_price: number;
    created_time: string;
  }

  interface IGoodsSku {
    attrs: ISkuItem[];
    attr_key: string;
    is_image: boolean;
    media_id: number;
    price: number;
    stock_num: number;
    code: string;
    cost_price: number;
    sold_num: number;
  }

  interface ISku {
    id: number;
    name: string;
    values: ISkuValues[]
  }

  interface ISkuValues {
    id: number;
    name: string
  }

  interface ISkuItem {
    id: number;
    name: string;
    alias: string;
    image: IMedia;
    defaultOpen: boolean;

  }

  interface IGroupItem {
    id: number;
    name: string;
    alias: string;
    is_image: boolean;
    defaultOpen: boolean;
    sku_list: ISkuItem[]
  }

  interface IMedia {
    id: number;
    mc_id: string;
    media_type: string;
    name: string;
    size: number;
    file_ext: string;
    path: string;
    url: string;
    image_url: string;
    meta: IMediaMeta;
    disk: string;
    width: number;
    height: number;
  }

  interface IMediaMeta {
    format: string;
    suffix: string;
    size: number;
    width: number;
    height: number;
  }

  interface IMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }
}

/**
 * models类型定义
 *
 * @interface IStores
 */
interface IStores {
  loading: {
    effects: string[]
  };
  goods: Models.IGoodsStore;
  media: Models.IMediaStore;
  global: Models.IGlobalStore;
}

interface IEffectsAction {
  payload?: any;
  callback?: (res: Models.IResponse) => void;
}
