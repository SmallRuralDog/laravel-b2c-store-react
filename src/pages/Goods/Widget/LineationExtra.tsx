import React from 'react';
import { Popover } from 'antd';
const centent = (<div style={{ width: 250 }}>
    <p>划线价在商品详情中显示示例：</p>
    <img style={{ width: '100%', height: '218.9px' }} src={'https://img.yzcdn.cn/public_files/2018/04/08/newPriceIntro.jpg'} />
</div>)
export default () => (
    <div>
        <span>商品没有优惠的情况下，划线价在商品详情会以划线形式显示。</span>
        <Popover content={centent} trigger='click' placement='top'>
            <a>示例</a>
        </Popover>
    </div>
);