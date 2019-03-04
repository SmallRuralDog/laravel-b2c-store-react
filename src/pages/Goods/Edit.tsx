import React from 'react';
import { connect } from 'dva';
import { Button, Card, Form, Icon, Input, Spin, Steps } from 'antd';
import ShareDescExtra from './Widget/ShareDescExtra';
import LineationExtra from './Widget/LineationExtra';
import FooterToolbar from '@/components/FooterToolbar';
import MediaDialog from '@/components/Media/MediaDialog';


import EditGoodsImageListR from './Widget/EditGoodsImageList';
import EditGoodsSkuR from './Widget/EditGoodsSku';
import GoodsSkuList from './Widget/GoodsSkuList';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { FormComponentProps } from 'antd/lib/form';
import { editGoodsBase } from '@/services/goods';
import FlexView from '@/components/Widget/FlexView';
import router from 'umi/router';
import reactComponentDebounce from 'react-component-debounce';
import _ from 'lodash';

const cartesian = require('cartesian');

const InputA = reactComponentDebounce(250)(Input);

const EditGoodsImageList = reactComponentDebounce(250)(EditGoodsImageListR);
const EditGoodsSku = reactComponentDebounce(50)(EditGoodsSkuR);

const styles = require('./Goods.less');

interface IProps extends FormComponentProps {
  goods: Models.IGoodsStore;
  dispatch: Models.dispatch;
  form_saveing: boolean;
  location?: any;
}

interface IState {
  sku_group: Models.IGroupItem[];
  is_edit: boolean;
  edit_goods_id: number;
  edit_goods: IEditGoods;
  sku_title_data;
  goods_skus;
}

@connect((store: IStores) => {
  return {
    goods: store.goods,
    form_saveing: store.loading.effects['goods/saveGoods'],
  };
})
class GoodsEdit extends React.Component<IProps, IState> {

  state = {
    sku_group: [],
    sku_title_data: [],
    goods_skus: [],
  } as IState;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/getGoodsAttr',
    });
    this.props.location.query.id > 0 && this.setState({
      is_edit: true,
      edit_goods_id: this.props.location.query.id,
    }, () => {
      this.getEditGoodsBase();
    });
  }

  getEditGoodsBase = async () => {
    const res = await editGoodsBase({ id: this.state.edit_goods_id });
    if (res && res.code === 200) {
      console.log(res.data);
      this.setState({
        edit_goods: res.data,
      });
    } else {
      router.goBack();
    }

  };

  handleSubmit = (e) => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log(values);
        dispatch({
          type: 'goods/saveGoods',
          payload: {
            ...values,
          },
          callback: (res) => {

          },
        });
      }
    });
  };

  handleGoodsSku = (sku_group) => {
    console.log('handleGoodsSku');

    const { edit_goods } = this.state;

    const sku_title_data = sku_group.map(item => {
      return {
        id: item.id,
        name: item.name,
      };
    });
    // 获取sku_list,过滤未选择的规格值
    const sku_list_data = sku_group.map(item => {
      return item.sku_list.filter(sku => {
        return sku.id > 0;
      });
    });
    // 计算笛卡尔积
    const sku_descartes = cartesian(sku_list_data);

    const goods_skus: Models.IGoodsSku[] = sku_descartes.map(item => {

      const attr_key_ids = item.map((ii) => {
        return ii.id;
      });

      const attr_key = _.sortBy(attr_key_ids).join('-');

      const edit_items = edit_goods && edit_goods.skus.length > 0 ? edit_goods.skus.filter((item) => {
        return item.attr_key === attr_key;
      }) : [];
      const edit_item = edit_items.length > 0 ? edit_items[0] : false;
      // console.log(edit_item);

      return {
        attrs: item,
        attr_key: attr_key,
        price: edit_item ? edit_item.price : null,
        stock_num: edit_item ? edit_item.stock_num : null,
        code: edit_item ? edit_item.code : null,
        cost_price: edit_item ? edit_item.cost_price : null,
        sold_num: edit_item ? edit_item.sold_num : 0,
        is_image: sku_group[0].is_image,
        media_id: item[0].image ? item[0].image.id : 0,
      } as Models.IGoodsSku;
    });

    this.setState({
      sku_group: sku_group,
      sku_title_data: sku_title_data,
      goods_skus: goods_skus,
    });
  };


  render() {
    console.log('Edit');
    const { edit_goods, is_edit, sku_title_data, goods_skus } = this.state;
    const { form_saveing, form, form: { getFieldDecorator, getFieldsError } } = this.props;

    return (
      <PageHeaderWrapper>
        {(is_edit && edit_goods) || !is_edit ?
          <div style={{ paddingBottom: 56 }}>
            <Card bodyStyle={{ padding: 20 }}>
              <div style={{ padding: '8px 10px', background: '#f5f7fa' }}>
                <Steps size='small'>
                  <Steps.Step title="编辑基本信息" icon={<Icon type="form" />} />
                  <Steps.Step title="编辑商品详情" icon={<Icon type="profile" />} />
                  <Steps.Step title="完成" icon={<Icon type="check-circle" />} />
                </Steps>
              </div>
              <Form onSubmit={this.handleSubmit}>
                <FormTitle title='基本信息' />
                <Form.Item {...formItemLayout} label='商品名' required extra={'商品标题长度至少3个字，最长50个汉字'}>
                  {getFieldDecorator('name', {
                    initialValue: edit_goods ? edit_goods.name : '',
                    rules: [
                      { required: true, message: '请输入商品名称' },
                      { max: 50, message: '长度最大为50' },
                    ],
                  })(
                    <InputA style={{ maxWidth: 500 }} allowClear={true} />,
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='分享描述' extra={<ShareDescExtra />}>
                  {getFieldDecorator('description', {
                    initialValue: edit_goods ? edit_goods.description : '',
                    rules: [
                      { max: 36, message: '长度最大为36' },
                    ],
                  })(
                    <InputA style={{ maxWidth: 500 }} allowClear={true} />,
                  )}

                </Form.Item>
                <Form.Item {...formItemLayout} label='商品图' required
                  extra={'建议尺寸：800*800像素，第一张为产品封面，你可以拖拽图片调整顺序，最多上传10张'}>
                  {getFieldDecorator('medias', {
                    rules: [
                      { required: true, message: '请选择图片' },
                    ],
                  })(
                    <EditGoodsImageList
                      medias={edit_goods ? edit_goods.medias : []}
                      {...this.props}
                      max={10} />,
                  )}
                </Form.Item>
                <FormTitle title='价格库存' />
                <Form.Item {...formItemLayout} label={'商品规格'} extra={'如有颜色、尺码等多种规格，请添加商品规格，最多添加3个规格'}>
                  {getFieldDecorator('goods_sku_group', {
                    rules: [],
                  })(
                    <EditGoodsSku
                      {...this.props}
                      goods={this.props.goods}
                      editData={edit_goods ? edit_goods.attrs : []}
                      maxGroup={3}
                      onChange={(sku_group) => {
                        this.handleGoodsSku(sku_group);
                      }}
                    />)}
                </Form.Item>
                {this.state.sku_group.length > 0 ? <div>
                  <Form.Item {...formItemLayout} label={'规格明细'}>
                    <GoodsSkuList
                      sku_group={this.state.sku_group}
                      sku_title_data={sku_title_data}
                      goods_skus={goods_skus}
                      form={form}
                    />
                  </Form.Item>
                </div> : null}
                <Form.Item {...formItemLayout} label='价格' required>
                  {getFieldDecorator('price', {

                    rules: [
                      { required: this.state.sku_group.length <= 0, message: '请输入价格' },
                    ],
                  })(
                    <InputA style={{ maxWidth: 130 }} addonBefore='￥' disabled={this.state.sku_group.length > 0} />,
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='成本价' extra='成本价未来会用于营销建议，利润分析等'>
                  {getFieldDecorator('cost_price', {
                    rules: [],
                  })(
                    <InputA style={{ maxWidth: 130 }} addonBefore='￥' disabled={this.state.sku_group.length > 0} />,
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='划线价' extra={<LineationExtra />}>
                  {getFieldDecorator('line_price', {
                    rules: [],
                  })(
                    <InputA style={{ maxWidth: 130 }} addonBefore='￥' />,
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='库存' required>
                  {getFieldDecorator('stock_num', {
                    rules: [
                      { required: this.state.sku_group.length <= 0, message: '请输入库存' },
                    ],
                  })(
                    <InputA style={{ maxWidth: 130 }} disabled={this.state.sku_group.length > 0} />,
                  )}
                </Form.Item>
                <FormTitle title='其他信息' />


                {getFieldDecorator('id', {
                  initialValue: edit_goods ? edit_goods.id : 0,
                  rules: [
                    { type: 'number' },
                  ],
                })(
                  <span />,
                )}

                <FooterToolbar extra="extra information">
                  <Button icon="save"
                    type={Object.values(getFieldsError()).filter(e => e).length <= 0 ? 'primary' : 'primary'}
                    htmlType='submit'
                    loading={form_saveing}>保存，并下一步</Button>
                </FooterToolbar>
              </Form>
            </Card>

            <MediaDialog />
          </div>
          : <Card bodyStyle={{ padding: 20 }}>
            <FlexView align={'center'} justify={'center'}
              style={{ height: 600, background: '#ffffff' }}>
              <Spin tip={'正在加载产品数据'} />
            </FlexView>
          </Card>
        }
      </PageHeaderWrapper>
    );
  }
}

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};
const FormTitle = ({ title }) => {
  return <div className={styles.formTitle}>{title}</div>;
};
export default Form.create()(GoodsEdit);
