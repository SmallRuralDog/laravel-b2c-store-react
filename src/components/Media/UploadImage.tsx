import React, { Component } from "react";
import storeConfig from '@/store.config';
import { Upload, message, Icon } from "antd";
import * as _ from 'lodash';
import { connect } from 'dva';
interface IProps {
    width: number;
    media?: Models.IMediaStore;
    global?: Models.IGlobalStore;
    loading?: boolean;
    dispatch?: Models.dispatch;
}
interface IState {

}
@connect(({ media, loading, global }) => {
    return {
        media,
        global,
        loading: loading.effects['media/getList'],
    };
})
class UploadImage extends Component<IProps, IState> {

    render() {
        const { width, media: { query, meta, list }, global, dispatch } = this.props

        return <div style={{ width: width }}>
            <Upload
                action={storeConfig.host + 'mediaUpload'}
                data={{ mc_id: query.mc_id || 1, type: query.type || 'image' }}
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
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                </div>
            </Upload></div>
    }
}

export default UploadImage;