import React, { Component } from 'react';
import { Button, Card } from 'antd';
import * as _ from 'lodash';
import SkuGroupEdit from './SkuGroupEdit';

const styles = require('./styles.less');

interface IProps {
  goods: Models.IGoodsStore;
  /**
   * 最大规格数
   */
  maxGroup: number;
  onChange: (sku_group: Models.IGroupItem[]) => void;

  editData?: any[];
}

interface IState {
  sku_group: Models.IGroupItem[]
}

class EditGoodsSku extends Component<IProps, IState> {
  state = {
    sku_group: [],
  } as IState;

  componentDidMount() {

    const { editData } = this.props;

    (editData && editData.length > 0) && this.initEditData(this.props.editData);
  }

  initEditData = (data) => {
    const newData: Models.IGroupItem[] = data.map((item) => {
      return {
        id: item.attr_id,
        name: item.name,
        alias: item.alias,
        is_image: item.is_image,
        defaultOpen: false,
        sku_list: item.values.map((value) => {
          return {
            id: value.attr_value_id,
            name: value.name,
            alias: value.alias,
            image: value.media,
            defaultOpen: false,
          } as Models.ISkuItem;
        }),
      } as Models.IGroupItem;
    });
    this.changeSkuGroup(newData);
  };

  addGroupItem = () => {
    const selfSkuGroup = _.cloneDeep(this.state.sku_group);
    selfSkuGroup.push(_.cloneDeep(GroupItem));
    this.changeSkuGroup(selfSkuGroup);
  };


  changeSkuGroup = (data: Models.IGroupItem[]) => {
    this.setState({
      sku_group: data,
    });

    let sendData = _.cloneDeep(data);
    sendData = sendData.map(itme => {
      itme.sku_list = itme.sku_list.filter(sku => {
        return sku.id > 0;
      });
      return itme;
    }).filter(item => {
      return item.id > 0 && item.sku_list.length > 0;
    });
    this.props.onChange(sendData);
  };

  shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>, nextContext: any): boolean {
    if (nextState.sku_group !== this.state.sku_group) {
      return true;
    }
    return false;
  }

  render() {

    const { sku_group } = this.state;
    const { goods, maxGroup } = this.props;

    console.log('EditGoodsSku');

    return <Card bodyStyle={{ padding: 0 }}>
      <SkuGroupEdit
        {...this.props}
        sku_group={sku_group}
        goods={goods}
        SkuItem={SkuItem}
        changeSkuGroup={this.changeSkuGroup}
      />
      <div className={styles.sku_group_title}>
        <Button disabled={sku_group.length >= maxGroup} type='primary' onClick={this.addGroupItem}>添加商品规格</Button>
        {sku_group.length > 5 ? <a className='ml-10'>自定义排序</a> : null}
      </div>
    </Card>;
  }
}


const SkuItem: Models.ISkuItem = {
  id: null,
  name: '',
  alias: '',
  image: null,
  defaultOpen: true,

};
const GroupItem: Models.IGroupItem = {
  id: null,
  name: '',
  alias: '',
  is_image: false,
  defaultOpen: true,
  sku_list: [_.clone(SkuItem)],
};

export default EditGoodsSku;
