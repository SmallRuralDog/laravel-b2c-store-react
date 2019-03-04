import React, { Component } from 'react';
import { Avatar, Card, Checkbox, Form, Icon, Input, InputNumber, message, Tooltip } from 'antd';
import reactComponentDebounce from 'react-component-debounce';
import FlexView from '@/components/Widget/FlexView';
import _ from 'lodash';

const InputA = reactComponentDebounce(250)(Input);
const InputNumberA = reactComponentDebounce(250)(InputNumber);

const styles = require('./styles.less');

interface IProps {
  sku_group: Models.IGroupItem[];
  sku_title_data;
  goods_skus;
  form;
}

interface IState {
  vs_price: number;
  vs_cost_price: number;
  vs_stock: number;
  vs_code: string;
  is_cover: boolean;
}

class GoodsSkuList extends Component<IProps, IState> {


  state = {
    vs_price: 0,
    vs_stock: 0,
    vs_cost_price: 0,
    vs_code: '',
    is_cover: false,
  } as IState;


  /**
   *  批量设置
   * @param field_name
   * @param goods_skus
   */
  volumeSet = (field_name: 'price' | 'stock_num' | 'cost_price' | 'code', goods_skus: Models.IGoodsSku[]) => {

    const { vs_stock, vs_price, vs_cost_price, vs_code, is_cover } = this.state;
    const { form: { setFieldsValue, getFieldValue } } = this.props;
    let vs_value;
    switch (field_name) {
      case 'price':
        vs_value = vs_price;
        break;
      case 'stock_num':
        vs_value = vs_stock;
        break;
      case 'cost_price':
        vs_value = vs_cost_price;
        break;
      case 'code':
        vs_value = vs_code;
        break;
    }
    if (vs_value > 0) {
      const fields = goods_skus.map((sku_item, index) => {
        const field = `goods_skus[${sku_item.attr_key}][${field_name}]`;
        const oldValue = getFieldValue(field);
        return oldValue <= 0 || is_cover ? field : false;

      }).filter((item) => {
        return item !== false;
      }).map((item) => {
        return [item, vs_value];
      });
      console.log(fields);
      setFieldsValue(_.fromPairs(fields));
    } else {
      message.warning(<span>设置数值必须大于<strong className='ml-5'>0</strong></span>);
    }
  };

  shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>, nextContext: any): boolean {
    if (nextProps.sku_group !== this.props.sku_group) {
      return true;
    }
    return true;
  }

  render() {


    const { sku_group, form: { getFieldDecorator }, sku_title_data, goods_skus } = this.props;

    console.log('GoodsSkuList');

    return <Card bodyStyle={{ padding: 0 }}>
      <div className={'ant-table ant-table-middle ant-table-scroll-position-left ' + styles.goods_skus_table}>
        <div className='ant-table-content'>
          <div className='ant-table-body'>
            <table>
              <colgroup>
                {sku_title_data.map((item, index) => {
                  const width = sku_title_data.length === 3 ? 10 : sku_title_data.length === 2 ? 15 : 30;
                  return <col style={{ width: width + '%' }} key={index}/>;
                })}
                <col style={{ width: 100 }}/>
                <col style={{ width: 100 }}/>
                <col style={{ width: 150 }}/>
                <col style={{ width: 100 }}/>
                <col style={{ width: 100, textAlign: 'right' }}/>
                <col/>
              </colgroup>
              <thead className='ant-table-thead'>
              <tr>
                {sku_title_data.map((item, index) => {
                  return <th key={index} className="th-sku">
                    <span>{item.name}</span>
                  </th>;
                })}
                <th className="th-price">价格（元）</th>
                <th className="th-stock">库存</th>
                <th className="th-code">规格编码 <Tooltip title='为方便管理，可以自定义编码，比如货号'><a><Icon
                  type="question-circle"/></a></Tooltip></th>
                <th className="text-cost-price">成本价 <Tooltip title='成本价未来会用于营销建议，利润分析等'><a><Icon
                  type="question-circle"/></a></Tooltip></th>
                <th className="text-right">销量</th>
              </tr>
              </thead>
              <tbody className={'ant-table-tbody ' + styles.goods_sku_tbody}>
              {goods_skus.map((sku_item, index) => {
                return <tr key={index} className='ant-table-row ant-table-row-level-0'>
                  {sku_item.attrs.map((item, item_index) => {
                    return <td key={item.id}>
                      <FlexView align={'center'}>
                        {item.image && sku_group[0].is_image && item_index === 0 ?
                          <Avatar style={{ marginRight: 5 }} shape='square' src={item.image.image_url}
                                  size={20}/> : null}
                        <span>{item.name}</span>
                      </FlexView>
                    </td>;
                  })}
                  <td>
                    <Form.Item>
                      {getFieldDecorator(`goods_skus[${sku_item.attr_key}][price]`, {
                        initialValue: sku_item.price,
                        rules: [
                          { required: true, message: '价格必填' },
                          { type: 'number', message: '必须是数字' },

                        ],
                      })(
                        <InputNumberA min={0} style={{ width: 100 }}/>,
                      )}
                    </Form.Item>
                  </td>
                  <td>
                    <Form.Item>
                      {getFieldDecorator(`goods_skus[${sku_item.attr_key}][stock_num]`, {
                        initialValue: sku_item.stock_num,
                        rules: [
                          { required: true, message: '库存必填' },
                          { type: 'number', message: '必须是数字' },

                        ],
                      })(
                        <InputNumberA min={0} style={{ width: 100 }}/>,
                      )}
                    </Form.Item>
                  </td>
                  <td>
                    <Form.Item>
                      {getFieldDecorator(`goods_skus[${sku_item.attr_key}][code]`, {
                        initialValue: sku_item.code,
                        rules: [
                          { type: 'string', message: '规格编码必填' },
                        ],
                      })(
                        <InputA style={{ width: 150 }} allowClear/>,
                      )}
                    </Form.Item>
                  </td>
                  <td>
                    <Form.Item>
                      {getFieldDecorator(`goods_skus[${sku_item.attr_key}][cost_price]`, {
                        initialValue: sku_item.cost_price,
                        rules: [
                          { type: 'number', message: '必须是数字' },
                        ],
                      })(
                        <InputNumberA min={0} style={{ width: 100 }}/>,
                      )}
                    </Form.Item>
                  </td>
                  <td>
                    {getFieldDecorator(`goods_skus[${sku_item.attr_key}][sold_num]`, {
                      initialValue: sku_item.sold_num,
                      rules: [],
                    })(
                      <span>{sku_item.sold_num}</span>,
                    )}
                    {getFieldDecorator(`goods_skus[${sku_item.attr_key}][attr_key]`, {
                      initialValue: sku_item.attr_key,
                      rules: [],
                    })(
                      <span/>,
                    )}
                    {getFieldDecorator(`goods_skus[${sku_item.attr_key}][is_image]`, {
                      initialValue: sku_item.is_image,
                      rules: [],
                    })(
                      <span/>,
                    )}
                    {getFieldDecorator(`goods_skus[${sku_item.attr_key}][media_id]`, {
                      initialValue: sku_item.media_id,
                      rules: [],
                    })(
                      <span/>,
                    )}
                  </td>

                </tr>;
              })}

              </tbody>
            </table>
          </div>
          <div className="ant-table-footer p-10 f-c" style={{ padding: 10 }}>
            <span>批量设置：</span>
            <div className='mr-10'>
              <Input
                placeholder='价格'
                style={{ width: 150 }}
                allowClear
                onChange={(e) => {
                  const { value } = e.target;
                  this.setState({
                    vs_price: _.toNumber(value),
                  });
                }}
                addonAfter={<a onClick={() => {
                  this.volumeSet('price', goods_skus);
                }}>设置</a>}
              />
            </div>
            <div className='mr-10'>
              <Input
                placeholder='库存'
                style={{ width: 150 }}
                allowClear
                onChange={(e) => {
                  const { value } = e.target;
                  this.setState({
                    vs_stock: _.toNumber(value),
                  });
                }}
                addonAfter={<a onClick={() => {
                  this.volumeSet('stock_num', goods_skus);
                }}>设置</a>}/>
            </div>
            <div className='mr-10'>
              <Input
                placeholder='成本价'
                style={{ width: 150 }}
                allowClear
                onChange={(e) => {
                  const { value } = e.target;
                  this.setState({
                    vs_cost_price: _.toNumber(value),
                  });
                }}
                addonAfter={<a onClick={() => {
                  this.volumeSet('cost_price', goods_skus);
                }}>设置</a>}/>
            </div>
            <Checkbox checked={this.state.is_cover} onChange={(e) => {
              this.setState({
                is_cover: e.target.checked,
              });
            }}>覆盖原有值</Checkbox>
          </div>
        </div>
      </div>

    </Card>;
  }
}

export default GoodsSkuList;
