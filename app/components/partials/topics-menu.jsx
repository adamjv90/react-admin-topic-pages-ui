import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {partial, map} from 'lodash';
import Input from 'components/shared/input';

export default React.createClass({
  displayName: 'TopicsMenu',

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    topics: PropTypes.array,
    showCreate: PropTypes.bool,
    editing: PropTypes.object,
    onAction: PropTypes.func,
    onRemove: PropTypes.func,
    onCreate: PropTypes.func
  },

  getInitialState() {
    return {
      topic: ''
    };
  },

  handleCreate(e) {
    e.preventDefault();
    this.props.onCreate(this.state.topic);
    this.setState({topic: ''});
  },

  renderItem(item, i) {
    let klass = classNames({
      editing: item.topic === this.props.editing.topic,
      [this.props.editing.action]: item.topic === this.props.editing.topic && this.props.editing.topic
    });

    return (
      <li className={klass} key={i}>
        <div className='menu-item-title'>{item.topic}</div>
        <div className="menu-item-actions">
          <div className="menu-item-actions-wrapper">
            <span className='menu-item-actions-action menu-item-actions-edit-slides' onClick={partial(this.props.onAction, item.topic, 'edit-slides')}>
              <span className="menu-item-action-count">({item.slides.length})</span>
              <span className="menu-item-actions-label link">Slides</span>
            </span>
            <span className='menu-item-actions-action menu-item-actions-edit-facetes' onClick={partial(this.props.onAction, item.topic, 'edit-facetes')}>
              <span className="menu-item-action-count">({item.facetes.length})</span>
              <span className="menu-item-actions-label link">Facetes</span>
            </span>
          </div>
          <div className="menu-item-edit-page-action">
            <span className='menu-item-cancel-action link' onClick={partial(this.props.onAction, '', '')}>Cancel</span>
          </div>
        </div>
        <i className="fa fa-close" onClick={partial(this.props.onRemove, item.topic)} />
      </li>
    );
  },

  render() {
    return (
      <div className='inner'>
        <div className='topic-menu-topics'>
          <ul>
            {map(this.props.topics, this.renderItem)}
          </ul>
        </div>

        <div className='topic-menu-new'>
          <form onSubmit={this.handleCreate}>
            <Input valueLink={this.linkState('topic')} label="New Topic" effect="yoko" style={{bottom: this.props.showCreate ? 0 : -72}} />
          </form>
        </div>
      </div>
    );
  }
});
