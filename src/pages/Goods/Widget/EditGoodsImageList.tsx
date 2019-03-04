import React, { Component } from 'react';
import AddImageView from '@/components/Widget/AddImageView';
import * as _ from 'lodash';
import SelectedImageView from '@/components/Widget/SelectedImageView';

import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';



interface IProp {
  max: number;
  onChange?: (images: Models.IMedia[]) => void;
  dispatch?: Models.dispatch,
  medias?: Models.IMedia[]
}

interface IState {
  images: Models.IMedia[]
}


class EditGoodsImageList extends Component<IProp, IState> {

  state = {
    images: [],
  } as IState;

  componentDidMount() {
    this.props.medias.length > 0 && this.onChangeImages(this.props.medias);
  }

  onAddImageViewClick = () => {
    const { images } = this.state;
    this.props.dispatch({
      type: 'media/show',
      payload: {
        max: 10 - images.length,
        selected: images,
        callBack: (res: Models.IMedia[]) => {
          const SelfImages = _.cloneDeep(images);
          res.map(item => {
            SelfImages.push(item);
          });
          this.onChangeImages(SelfImages);
        },
      },
    });
  };

  onChangeImages = (images: Models.IMedia[]) => {
    this.setState({
      'images': images,
    });
    this.props.onChange(images);
  };

  shouldComponentUpdate(nextProps: Readonly<{ max: number; onChange?: (images: Models.IMedia[]) => void; dispatch?: Models.dispatch; medias?: Models.IMedia[] }>, nextState: Readonly<IState>, nextContext: any): boolean {
    if (nextState.images !== this.state.images) {
      return true;
    }
    return false;
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const newImages = arrayMove(this.state.images, oldIndex, newIndex)

    this.onChangeImages(newImages)
  };

  render() {
    console.log('EditGoodsImageList');
    const { images } = this.state;
    const { max } = this.props;


    const SortableItem = SortableElement(({ value }) =>
      <SelectedImageView
        width={94}
        height={94}
        item={value}

        border={true}
        className='mr-10 mb-10'
        showDelBtn={true}
        onDel={(delItem) => {

          const SelfImages = _.cloneDeep(this.state.images);

          const newData = SelfImages.filter((item) => {
            return item.id !== delItem.id
          })

          this.onChangeImages(newData);
        }}
      />);

    const SortableList = SortableContainer(({ items }) => {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value} />
          ))}
          {images.length < max ? <div onClick={this.onAddImageViewClick} style={{ display: 'inline-block' }}>
            <AddImageView width={100} height={100} border={true} />
          </div> : null}
        </div>
      );
    });

    return <SortableList items={images} axis='x' onSortEnd={this.onSortEnd} distance={1} />;
  }
}

export default EditGoodsImageList;
