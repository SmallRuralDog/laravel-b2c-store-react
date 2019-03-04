import React, { Component } from 'react';
import SkuSelect from './SkuSelect';
import * as _ from 'lodash';
import { Button, Checkbox, Icon, Select, Tooltip } from 'antd';
import AddImageView from '@/components/Widget/AddImageView';
import SelectedImageView from '@/components/Widget/SelectedImageView';
import { createGoodsAttr, createGoodsAttrValue } from '@/services/goods';

const styles = require('./styles.less');

class SkuGroupEdit extends Component<{
  sku_group: Models.IGroupItem[];
  goods: Models.IGoodsStore;
  SkuItem: Models.ISkuItem;
  dispatch?: Models.dispatch;
  changeSkuGroup: (data: Models.IGroupItem[]) => void;
}, {
  addSkuValueImage: boolean;
}> {

  state = {
    addSkuValueImage: false,
  };


  changeSkuGroup = (data) => {
    this.props.changeSkuGroup(data);
  };

  shouldComponentUpdate(nextProps: Readonly<{ sku_group: Models.IGroupItem[]; goods: Models.IGoodsStore; SkuItem: Models.ISkuItem; dispatch?: Models.dispatch; changeSkuGroup: (data: Models.IGroupItem[]) => void }>, nextState: Readonly<{ addSkuValueImage: boolean }>, nextContext: any): boolean {

    if (nextProps.sku_group !== this.props.sku_group) {
      return true;
    }
    return false;
  }

  render() {
    console.log('SkuGroupEdit');
    const { sku_group, goods, SkuItem, dispatch } = this.props;
    return <div>
      {sku_group.map((SkuGroupItem, SkuGroupIndex) => {
        return <div key={SkuGroupIndex}>
          <div className={styles.sku_group_title}>
            <span>规格名：</span>
            <div className='f-c' style={{ flex: 1 }}>
              <SkuSelect
                style={{ width: 150 }}
                value={SkuGroupItem.id}
                onSelect={(value, option) => {
                  const newSKuGroup = _.clone(sku_group);
                  newSKuGroup[SkuGroupIndex].id = value as number;
                  newSKuGroup[SkuGroupIndex].name = option.key;
                  newSKuGroup[SkuGroupIndex].sku_list = [_.clone(SkuItem)];
                  this.changeSkuGroup(newSKuGroup);
                }}
                onCreate={async (value) => {
                  const res = await createGoodsAttr({ name: value });
                  if (res.code === 200) {
                    dispatch({
                      type: 'goods/setState',
                      payload: {
                        skus: res.data.attr_list,
                      },
                    });
                    const newSKuGroup = _.clone(sku_group);
                    newSKuGroup[SkuGroupIndex].id = res.data.attr.id;
                    newSKuGroup[SkuGroupIndex].name = res.data.attr.name;
                    newSKuGroup[SkuGroupIndex].sku_list = [_.clone(SkuItem)];
                    this.changeSkuGroup(newSKuGroup);
                  }
                }}
              >
                {goods.skus.map((item, index) => {
                  const disabled = _.filter(sku_group, (sg) => {
                    return sg.id === item.id;
                  }).length > 0;
                  return <Select.Option
                    disabled={disabled}
                    value={item.id}
                    key={item.name}>{item.name}</Select.Option>;
                })}
              </SkuSelect>
              {SkuGroupIndex === 0 ? <div className={'f-c-c font-12 ml-10'}><Tooltip title={Text.add_image}>
                <Checkbox checked={this.state.addSkuValueImage || sku_group[0].is_image} onChange={(e) => {
                  const newSKuGroup = _.clone(sku_group);
                  newSKuGroup[SkuGroupIndex].is_image = e.target.checked;
                  this.changeSkuGroup(newSKuGroup);
                  this.setState({
                    addSkuValueImage: e.target.checked,
                  });

                }}><a>添加规格图片</a></Checkbox>
              </Tooltip></div> : null}
            </div>
            <Tooltip title='删除规格组'>
              <a
                style={{ lineHeight: 1 }}
                onClick={() => {
                  const newSKuGroup = _.clone(sku_group);
                  _.pull(newSKuGroup, newSKuGroup[SkuGroupIndex]);
                  this.changeSkuGroup(newSKuGroup);
                }}
              >
                <Icon type="close-circle" style={{ fontSize: 16 }} /></a>
            </Tooltip>
          </div>
          <div className={styles.sku_group_container}>
            <span style={{ flexShrink: 0, lineHeight: '30px' }}>规格值：</span>
            {SkuGroupItem.id ?
              <div className='flex' style={{ flexWrap: 'wrap', flex: 1 }}>
                {SkuGroupItem.sku_list.map((SkuListItem, SkuListIndex) => {
                  const selfSku = _.first(_.filter(goods.skus, (gs) => {
                    return gs.id === SkuGroupItem.id;
                  }));
                  return <div key={SkuListIndex} className={'mr-10 mb-10 ' + styles.sku_values_item}>
                    <SkuSelect
                      style={{ width: 150 }}
                      value={SkuListItem.id}
                      onSelect={(value, option) => {
                        const newSKuGroup = _.clone(sku_group);
                        newSKuGroup[SkuGroupIndex].sku_list[SkuListIndex].id = value as number;
                        newSKuGroup[SkuGroupIndex].sku_list[SkuListIndex].name = option.key;
                        this.changeSkuGroup(newSKuGroup);
                      }}
                      onCreate={async (value) => {
                        const newSKuGroup = _.clone(sku_group);
                        const res = await createGoodsAttrValue({ attr_id: newSKuGroup[SkuGroupIndex].id, name: value });
                        if (res.code === 200) {
                          dispatch({
                            type: 'goods/setState',
                            payload: {
                              skus: res.data.attr_list,
                            },
                          });
                          newSKuGroup[SkuGroupIndex].sku_list[SkuListIndex].id = res.data.attr_value.id;
                          newSKuGroup[SkuGroupIndex].sku_list[SkuListIndex].name = res.data.attr_value.name;
                          this.changeSkuGroup(newSKuGroup);
                        }
                      }}
                    >
                      {selfSku ?
                        selfSku.values.map((valueItem, valueIndex) => {
                          const disabled = _.filter(sku_group[SkuGroupIndex].sku_list, (sl) => {
                            return sl.id === valueItem.id;
                          }).length > 0;
                          return <Select.Option disabled={disabled} value={valueItem.id}
                            key={valueItem.name}>{valueItem.name}</Select.Option>;
                        })
                        : null}
                    </SkuSelect>
                    <Tooltip title='删除此规格值'>
                      <a
                        className={styles.sku_values_item_del_btn}
                        onClick={() => {
                          const newSKuGroup = _.clone(sku_group);
                          newSKuGroup[SkuGroupIndex].sku_list = _.pull(newSKuGroup[SkuGroupIndex].sku_list, newSKuGroup[SkuGroupIndex].sku_list[SkuListIndex]);
                          this.changeSkuGroup(newSKuGroup);
                        }}
                      >
                        <Icon type="close-circle" theme='twoTone' style={{ fontSize: 15 }} />
                      </a>
                    </Tooltip>
                    {SkuGroupIndex === 0 && (this.state.addSkuValueImage || sku_group[0].is_image) ?
                      <div className={'mt-10'}>
                        <div className={'f-c ' + styles.sku_image}>
                          <div className={styles.arrow} />
                          <div
                            onClick={() => {
                              this.props.dispatch({
                                type: 'media/show',
                                payload: {
                                  max: 1,
                                  callBack: ((res: Models.IMedia[]) => {
                                    const newSKuGroup = _.clone(sku_group);
                                    newSKuGroup[SkuGroupIndex].sku_list[SkuListIndex].image = res[0];
                                    this.changeSkuGroup(newSKuGroup);
                                  }),
                                },
                              });
                            }}
                            style={{ border: '1px solid #d9d9d9' }}
                          >
                            {
                              SkuListItem.image ?
                                <SelectedImageView width={100} height={100} item={SkuListItem.image} border={false} />
                                : <AddImageView width={100} height={100} border={false} />
                            }
                          </div>
                        </div>
                      </div> : null}
                  </div>;
                })
                }
                <Button
                  className='mb-10'
                  style={{ flexShrink: 0 }}
                  disabled={sku_group[SkuGroupIndex].sku_list.length >= 40}
                  onClick={() => {
                    const newSKuGroup = _.clone(sku_group);
                    newSKuGroup[SkuGroupIndex].sku_list.push(_.clone(SkuItem));
                    this.changeSkuGroup(newSKuGroup);
                  }}><Icon type="plus" />添加规格值</Button>
              </div>
              : null
            }

          </div>
        </div>;
      })}
    </div>;

  }
}

const Text = {
  add_image: '仅支持为第一组规格设置规格图片，买家选择不同规格会看到对应规格图片，建议尺寸：800 x 800像素',
};
export default SkuGroupEdit;
