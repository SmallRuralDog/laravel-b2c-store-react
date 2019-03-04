import React, { PureComponent } from "react";
import { Card, Icon, Popover, Popconfirm } from "antd";
const styles = require('./styles.less');
class MediaItem extends PureComponent<{
    imageSize: number;
    item: Models.IMedia;
    onItemClick: (item: Models.IMedia) => void;
    dispatch?: Models.dispatch
}, {}> {
    onDel = () => {
        const { dispatch, item } = this.props
        dispatch({
            type: 'media/delMedia',
            payload: {
                ids: [item.id],
                type: item.media_type
            }
        })
    }
    render() {
        const { imageSize, item, onItemClick, children } = this.props
        return <Card
            className={styles.media_item}
            bodyStyle={{ padding: 0 }}
            cover={<a onClick={() => {
                onItemClick(item);
            }}>
                <div className={styles.image_item} style={{ width: '100%', height: imageSize, overflow: 'hidden', backgroundImage: `url(${item.image_url})` }}></div>
            </a>}
            size={'small'}
            actions={[
                <Icon key={'setting'} type={'setting'} />,
                <Popconfirm key={'del'} title='确定要删除此图片吗？' onConfirm={this.onDel}>
                    <Icon type={'close-circle'} />
                </Popconfirm>,
                <Popover
                    key={'info'}
                    title={item.name}
                    content={
                        <div>
                            <div>分辨率：{item.width} x {item.height}</div>
                            <div>大小：{item.size}</div>
                        </div>
                    }
                >
                    <Icon type={'info-circle'} />
                </Popover>,
            ]}
        >
            {children}
        </Card>
    }
}
export default MediaItem;