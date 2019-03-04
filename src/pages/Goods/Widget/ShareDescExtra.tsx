import React from 'react';
import { Popover } from 'antd';
const centent = (<div style={{ width: 250 }}>
    <p>将商品在微信分享给朋友时，该处填写的内容会展示在商品名称下面</p>
    <img style={{ width: '100%' }} src={'https://img.yzcdn.cn/public_files/2018/04/04/249513f376732ac3d353adcc16a5da5d.png'} />
</div>)
export default () => (
    <div>
        <span>分享给好友时会显示，建议36个字以内。</span>
        <Popover content={centent} trigger='click' placement='bottom'>
            <a>查看示例</a>
        </Popover>
    </div>
);