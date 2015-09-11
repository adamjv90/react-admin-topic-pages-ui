import React, {PropTypes} from 'react';
import update from 'react/lib/update';
import {partial, map} from 'lodash';
import EditSlide from 'components/partials/edit-slide';
import Input from 'components/shared/input';

export default React.createClass({
  displayName: 'TopicsMenu',

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    slides: PropTypes.array,
    onSave: PropTypes.func,
    onCancel: PropTypes.func
  },

  getInitialState() {
    return {
      slides: this.props.slides,
      title: ''
    };
  },

  componentWillReceiveProps(props) {
    this.setState(Object.assign(this.state, {slides: props.slides}));
  },

  createSlide(title) {
    this.setState(update(this.state, {
      slides: {
        $unshift: [{
          title: title,
          url: '',
          description: '',
          image: ''
        }]
      }
    }));
  },

  removeSlide(index) {
    this.setState(update(this.state, {
      slides: {
        $splice: [[index, 1]]
      }
    }));
  },

  handleCreate(e) {
    e.preventDefault();
    this.createSlide(this.state.title);
    this.setState({title: ''});
  },

  handleChange(i, attribute, value) {
    this.setState(update(this.state, {
      slides: {
        $splice: [[i, 1, update(this.state.slides[i], {
          [attribute]: {
            $set: value
          }
        })]]
      }
    }));
  },

  handleSave() {
    this.props.onSave(this.state.slides);
  },

  render() {
    return (
      <div className="inner">
        <div className="edit-slides edit-content">
          {map(this.state.slides, (slide, i) => <EditSlide {...slide} key={i} onRemove={partial(this.removeSlide, i)} onChange={partial(this.handleChange, i)} />)}
        </div>
        <div className='edit-slides-toolbar edit-toolbar'>
          <form onSubmit={this.handleCreate}>
            <Input valueLink={this.linkState('title')} label="New Slide Title" effect="yoko" />
          </form>
          <div className="edit-slides-actions edit-actions">
            <span className="btn" onClick={this.handleSave}>Save</span>
            <span className="btn cancel red" onClick={this.props.onCancel}>Cancel</span>
          </div>
        </div>
      </div>
    );
  }
});
