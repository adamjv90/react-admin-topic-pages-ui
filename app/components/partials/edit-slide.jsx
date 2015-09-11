import React, {PropTypes} from 'react';
import {isUndefined, partial} from 'lodash';
import Dropzone from 'react-dropzone';

export default React.createClass({
  displayName: 'EditSlide',

  propTypes: {
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    title: PropTypes.string,
    url: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string
  },

  setImageFromDrop(files, e) {
    const data = JSON.parse(e.dataTransfer.getData('application/json'));

    if (!isUndefined(data) && !isUndefined(data.src)) {
      this.props.onChange('image', data.src);
    }
  },

  render() {
    let style = {};

    if (this.props.image) {
      style = {backgroundImage: `url(${this.props.image})`};
    }

    return (
      <div className="edit-slide">
        <div className="edit-slide-image" style={style}>
          <Dropzone disableClick={true} onDrop={this.setImageFromDrop} style={{width: '100%', paddingBottom: '53.6%'}} />

          <div className="edit-slide-title-fields">
            <input className="edit-slide-title-input" valueLink={{value: this.props.title, requestChange: partial(this.props.onChange, 'title')}} placeholder="Title" />
            <input valueLink={{value: this.props.url, requestChange: partial(this.props.onChange, 'url')}} placeholder="URL" />
          </div>

          <div className="edit-slide-description-fields">
            <textarea valueLink={{value: this.props.description, requestChange: partial(this.props.onChange, 'description')}} placeholder="Description" />
          </div>

          <i className="fa fa-close" onClick={this.props.onRemove} />
        </div>
        <input value={this.props.image} style={{display: 'none'}} />
      </div>
    );
  }
});
