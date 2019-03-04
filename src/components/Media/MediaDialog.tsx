import FlexView from '@/components/Widget/FlexView';
import storeConfig from '@/store.config';
import { Button, Col, Icon, Input, List, message, Modal, Pagination, Row, Tabs, Upload } from 'antd';
import { ColumnCount } from 'antd/lib/list';
import { connect } from 'dva';
import * as _ from 'lodash';
import React, { Component } from 'react';
import MediaItem from './MediaItem';
import { createMediaCategoryList } from '@/services/media';

const styles = require('./styles.less');

interface IProps {
  media?: Models.IMediaStore;
  global?: Models.IGlobalStore;
  loading?: boolean;
  dispatch?: Models.dispatch;
}

interface IState {
  selectedInit: boolean;
  selected: Models.IMedia[];
  uploadLoading: boolean;
  isUpload: boolean;
}

/**
 *
 *
 * @author zhangwei
 * @class MediaDialog
 * @extends {Component<IProps, IState>}
 */
@connect(({ media, loading, global }) => {
  return {
    media,
    global,
    loading: loading.effects['media/getList'],
  };
})
class MediaDialog extends Component<IProps, IState> {
  state = {
    selected: [],
  } as IState;


  onHide = () => {
    this.props.dispatch({
      type: 'media/hide',
      payload: {},
    });
    this.setState({
      'selected': [],
      'selectedInit': false,
    });
  };

  onOk = () => {
    this.props.media.callBack(this.state.selected);
    this.onHide();
  };
  onItemClick = (item: Models.IMedia) => {
    let selected: Models.IMedia[] = _.clone(this.state.selected);
    const { media: { max } } = this.props;
    const CheckItem = _.filter(selected, (s) => {
      return s.id === item.id;
    });
    if (max === 1) {
      if (CheckItem.length > 0) {
        _.pullAll(selected, CheckItem);
      } else {
        selected = [item];
      }
    } else if (max > 1) {
      if (CheckItem.length > 0) {
        _.pullAll(selected, CheckItem);
      } else {
        selected.push(item);
      }
    }
    if (selected.length > max) {
      return;
    }
    this.setState({
      'selected': selected,
    });
  };


  render() {

    const { media: { visible, list, max, meta, query, categoryList }, loading, dispatch, global } = this.props;
    const { selected, isUpload } = this.state;
    const Title = () => (<Row type={'flex'} justify={'space-between'} align={'middle'}>
      <Col><strong>媒体中心</strong></Col>
      <Col>
        <FlexView>
          <Input placeholder='输入目录名称' onPressEnter={async (e) => {
            // @ts-ignore
            const value = e.target.value;
            if (value.length > 4) {
              message.warning('最多四个字');
              return;
            }
            const res: Models.IResponse = await createMediaCategoryList({ name: value, type: query.type || 'image' });
            if (res && res.code === 200) {
              message.success('创建成功');
              dispatch({ type: 'media/getCategoryList' });
            }

          }}/>
          <Button
            onClick={() => {
              this.setState({ isUpload: !isUpload });
            }}

            className='ml-5' type="primary">{isUpload ? '返回列表' : '上传图片'}</Button>
        </FlexView>
      </Col>
    </Row>);

    const Check = ({ item }) => {
      const { media: { max } } = this.props;
      const index = _.indexOf(this.state.selected, item);
      return index > -1 ? <a
        className={styles.attachment_selected}
        onClick={() => {
          this.onItemClick(item);
        }}>
        {max > 1 ?
          <i className={styles.selected_index}>{index + 1}</i> :
          <span className={styles.selected_index}><Icon type="check" style={{ color: '#fff' }}/></span>

        }
      </a> : null;
    };

    const Item = ({ item }) => {
      return <MediaItem
        item={item}
        imageSize={imageSize}
        onItemClick={this.onItemClick}
        {...this.props}
      >
        <Check item={item}/>
      </MediaItem>;
    };
    const ListHeight = (imageSize + 34) * 3 + (16 * 2) + 64 + 8;

    return <Modal
      title={<Title/>}
      visible={visible}
      width={medisArrts.width + 104}
      closable={false}
      centered={true}
      maskClosable={false}
      wrapClassName={'media-dialog'}
      bodyStyle={{ padding: 0 }}
      onCancel={this.onHide}
      onOk={this.onOk}
      footer={
        <FlexView align='center' justify='space-between'>
          <div>
            <span>可选择：{max - this.state.selected.length} </span>
          </div>
          <div>
            <Button onClick={this.onHide}>取消</Button>
            <Button disabled={selected.length <= 0} onClick={this.onOk} type='primary'>确定</Button>
          </div>
        </FlexView>
      }
    >
      <div
        className={styles.media_list}
        style={{ height: ListHeight }}>
        <FlexView>
          <Tabs
            tabPosition={'left'}
            size={'small'}
            activeKey={query.mc_id.toString()}
            style={{ width: 104, height: ListHeight, flexShrink: 0 }}
            onTabClick={(key) => {
              if (key === query.mc_id) {
                return;
              }
              console.log(key);
              const newQuery = _.clone(query);
              newQuery.mc_id = key;
              dispatch({ type: 'media/setState', payload: { query: newQuery } });
              dispatch({type:'media/getList'})
            }}
          >
            <Tabs.TabPane key={'0'} tab={'全部媒体'}/>
            {categoryList && categoryList.map((item) => {
              return <Tabs.TabPane key={item.id} tab={item.name}/>;
            })}
          </Tabs>
          <FlexView direction='column' justify='space-between'
                    style={{ padding: 16, flex: 1, height: ListHeight, overflow: 'auto' }}>
            {isUpload ? <div>
                <Upload
                  action={storeConfig.host + 'mediaUpload'}
                  data={{ mc_id: query.mc_id || 0, type: query.type || 'image' }}
                  headers={{ 'X-CSRF-TOKEN': global.store.token }}
                  listType="picture-card"
                  multiple={true}
                  onChange={(info) => {
                    const status = info.file.status;
                    if (status === 'uploading') {

                    } else if (status === 'done') {
                      if (meta.current_page === 1) {
                        const selfList = _.clone(list);
                        const selfMeta = _.clone(meta);
                        const data = info.file.response.data;
                        selfList.unshift(data);
                        dispatch({
                          type: 'media/setList',
                          payload: {
                            data: {
                              data: selfList,
                              meta: selfMeta,
                            },
                          },
                        });
                      } else {
                        dispatch({
                          type: 'media/pageChange',
                          payload: {
                            page: 1,
                          },
                        });
                      }
                    } else if (status === 'error') {
                      message.error(`${info.file.name} 上传失败`);
                    }
                  }}
                >
                  <div>
                    <Icon type="plus"/>
                    <div className="ant-upload-text">上传图片</div>
                  </div>
                </Upload>
              </div> :
              <div>
                <List
                  loading={loading}
                  grid={{ gutter: medisArrts.gutter, column: medisArrts.column }}
                  dataSource={list}
                  renderItem={(item: Models.IMedia) => {
                    return <List.Item>
                      <Item item={item}/>
                    </List.Item>;
                  }}
                />
                <FlexView justify='center'>
                  {meta.total ? <Pagination
                    hideOnSinglePage
                    current={meta.current_page}
                    total={meta.total}
                    pageSize={meta.per_page}
                    size={'small'}
                    showQuickJumper
                    onChange={(e) => {
                      dispatch({
                        type: 'media/pageChange',
                        payload: {
                          page: e,
                        },
                      });
                    }}
                  /> : null}
                </FlexView>
              </div>
            }
          </FlexView>

        </FlexView>
      </div>
    </Modal>;
  }
}

const medisArrts = {
  width: 900,
  padding: 16,
  gutter: 16,
  column: 6 as ColumnCount,
};
const imageSize = (medisArrts.width - medisArrts.padding * 2 - medisArrts.gutter * (medisArrts.column - 1) - medisArrts.column * 2) / medisArrts.column;


export default MediaDialog;
