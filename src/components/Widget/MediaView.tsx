import React,{ Component } from "react";
const styles = require('./styles/MediaView.less')
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

    /**
     * 媒体对象
     */
    item: Models.IMedia;
    /**
     * 类
     */
    className?: string;
}

interface IState {

}
class MediaView extends Component<IProps,IState>{
    render() {
        const { width, height, border, item, className} = this.props;
        return <div className={`add-image-view ${className?className:''} ` + styles.image_view}
            style={{ border: border ? '1px solid #d9d9d9' : null }}>
            <div className={styles.image_item} style={{ width: width, height: height, overflow: 'hidden', backgroundImage: `url(${item.image_url})` }}></div>
        </div>;
    }
}
export default MediaView;