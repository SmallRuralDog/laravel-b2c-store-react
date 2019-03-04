import React, { PureComponent } from "react";
import { Icon } from "antd";
interface IProps {
    /**
     * 布局宽
     */
    width: number;
    /**
     * 布局高
     */
    height: number;
    /**
     * 是否显示边框
     */
    border?: boolean;

}
interface IState {

}
class AddImageView extends PureComponent<IProps, IState> {
    render() {
        const { width, height, border } = this.props;
        return <a className='add-image-view'
            style={{ width: width + 'px', height: height + 'px', border: border ? '1px solid #d9d9d9' : null }}>
            <span><Icon type="plus-circle" /> 添加图片</span>
        </a>
    }
}

export default AddImageView;