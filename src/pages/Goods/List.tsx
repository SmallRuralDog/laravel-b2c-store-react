import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Icon, Row, Table, Tag } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import { ColumnProps } from 'antd/lib/table';
import ButtonGroup from 'antd/lib/button/button-group';
import Link from 'umi/link';
import MediaView from '@/components/Widget/MediaView';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

interface IProps {
  goods: Models.IGoodsStore
  loading: boolean
  dispatch: Models.dispatch
}

interface IState {

}

@connect((store: IStores) => {
  const { goods, loading } = store;
  return {
    goods: goods,
    loading: loading.effects['goods/getGoodsList'],
  };
})
class GoodsListPage extends Component<IProps, IState> {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/showGoodsList',
      payload: {
        page: 1,
      },
      callback: (res) => {
        console.log(res.code);
      },
    });
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/listSorterChange',
      payload: {
        field: sorter.field,
        order: sorter.order,
      },
    });

  };
  ListTitle = (
    <div>
      <ButtonGroup>
        <Button>出售中</Button>
        <Button>已售馨</Button>
        <Button>仓库中</Button>
      </ButtonGroup>
    </div>
  );

  render() {
    const { goods: { list, meta }, loading, dispatch } = this.props;
    return <PageHeaderWrapper>
      <Card bordered={false} bodyStyle={{ padding: 0, borderRadius: 0 }}>
        <div className='p-10'>
          <div className='mb-10'>
            <Link to='/goods/edit'>
              <Button type='primary'><Icon type="plus-circle"/>添加产品</Button>
            </Link>

          </div>
          <div className='bg-block p-10'>

          </div>
        </div>
        <Table
          bordered={false}
          rowKey="id"
          size="middle"
          columns={columns}
          dataSource={list}
          loading={loading}
          rowClassName={() => 'font-12'}
          rowSelection={this.rowSelection}
          title={() => this.ListTitle}
          onChange={this.handleTableChange}
          pagination={{
            hideOnSinglePage: true,
            current: meta.current_page,
            total: meta.total,
            pageSize: meta.per_page,
            onChange: (e) => {
              dispatch({
                type: 'goods/listPageChange',
                payload: {
                  page: e,
                },
              });
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>;
  }
}

export default GoodsListPage;
const columns: ColumnProps<Models.IGoods>[] = [
  {
    title: '商品信息',
    dataIndex: 'price',
    width: '30%',
    sorter: true,
    render: (text, record, index) => {
      return <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flexShrink: 0 }}>
          <MediaView item={record.cover} width={55} height={55} border/>
        </div>
        <div className='ml-10'>
          <Row type='flex' justify='space-between' style={{ height: 64 }}>
            <Col span={24} style={{ height: 36, lineHeight: '18px', fontSize: '12px' }}><Ellipsis
              lines={2}>{record.name}</Ellipsis></Col>
            <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
              {1 > 2 ? <Tag color='#4b8'>分销</Tag> : null}
              <span style={{ color: '#f60', fontSize: 14 }}>￥ {record.price}</span>
            </Col>
          </Row>
        </div>

      </div>;
    },
  },
  {
    title: '访问量',
    render: (text, item) => {
      return <div className='font-12'>
        <div>浏览量：</div>
        <div>访客数：</div>
      </div>;
    },
  },
  {
    title: '库存',
    dataIndex: 'stock_num',
    sorter: true,
  },
  {
    title: '总销量',
    sorter: true,
    dataIndex: 'sold_num',
  },
  {
    title: '创建时间',
    sorter: true,
    dataIndex: 'created_time',
  },
  {
    title: '序号',
    dataIndex: 'is_used',
    sorter: true,
  },
  {
    title: '操作',
    width: '25%',
    align: 'right',
    render: (text, item, index) => {
      return <div>
        <Link to={{ pathname: '/goods/edit', query: { id: item.id } }}>
          <Button size='small' className='mr-5'>编辑</Button>
        </Link>
        <Button size='small'>下架</Button>
      </div>;
    },
  }];
