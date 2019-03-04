import React, { Component } from 'react';
import { Select } from 'antd';

interface IProps {
  children?;
  style?;
  value?;
  onSelect?: (value, option?) => void;
  onCreate?: (value: string) => void;
}

interface IState {
  defaultOpen: boolean;
  newName: string;
}

class SkuSelect extends Component<IProps, IState> {

  state = {
    defaultOpen: true,
    newName: '',
  } as IState;


  onDropdownVisibleChange = () => {
    this.setState({
      defaultOpen: false,
    });
  };

  onCreate = () => {
    this.props.onCreate(this.state.newName);
  };

  shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>, nextContext: any): boolean {


    return true;
  }

  render() {
    const { defaultOpen, newName } = this.state;

    const { value } = this.props;
    return <Select
      {...this.props}
      dropdownMatchSelectWidth={false}
      defaultOpen={defaultOpen && !value}
      onDropdownVisibleChange={this.onDropdownVisibleChange}
      autoFocus
      notFoundContent={newName ? <div><a onClick={this.onCreate}>点击创建</a>：{newName} </div> : '暂无规格，请输入创建'}
      showSearch
      filterOption={(input, option) => {
        return option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
      onSearch={(value) => {
        this.setState({
          newName: value,
        });
      }}
    >
      {this.props.children}
    </Select>;
  }
}


export default SkuSelect;
