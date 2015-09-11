import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {partial, isEqual, isUndefined, difference} from 'lodash';
import Input from 'components/shared/input';
import AutocompleteTagger from 'components/shared/autocomplete-tagger';
import {DragSource, DropTarget} from 'react-dnd';
import {addClass, removeClass} from 'utils/dom-class';

const dropTarget = DropTarget;
const dragSource = DragSource;

const draggableSource = {
  beginDrag(props, monitor, component) {
    addClass(component.getDOMNode().parentNode, 'is-dragging');
    return { term: props.term };
  },
  endDrag(props, monitor, component) {
    removeClass(component.getDOMNode().parentNode, 'is-dragging');
  }
};

const draggableTarget = {
  hover(props, monitor) {
    const draggedTerm = monitor.getItem().term;
    if (draggedTerm !== props.term) {
      props.onSort(draggedTerm, props.term);
    }
  }
};

const DraggableFacete = React.createClass({
  displayName: 'EditSlide',

  propTypes: {
    suggestions: PropTypes.array,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    term: PropTypes.string,
    terms: PropTypes.array,
    recommended: PropTypes.object,

    connectDragSource: PropTypes.func,
    connectDropTarget: PropTypes.func,
    connectDragPreview: PropTypes.func
  },

  getInitialState(nextProps) {
    const props = isUndefined(nextProps) ? this.props : nextProps;
    const sorted = Array.prototype.slice.call(props.terms).sort();

    return {
      sorted: sorted,
      isSortable: !isEqual(props.terms, sorted)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this.getInitialState(nextProps));
  },

  handleSort() {
    this.props.onChange('terms', this.state.sorted);
  },

  appendTags(tags) {
    this.props.onChange('terms', this.props.terms.concat(tags));
  },

  render() {
    const {connectDragSource, connectDropTarget, connectDragPreview} = this.props;
    const recommended = difference(this.props.recommended[this.props.term], this.props.terms);

    return connectDragPreview(connectDropTarget(
      <div className="edit-facete">
        <div className="edit-facete-term-header">
          <div className="edit-facete-term-actions">
            {connectDragSource(
              <i className="fa fa-bars" />
            )}
            <i className="fa fa-close" onClick={this.props.onRemove} />
          </div>
          <div className="edit-facete-term">
            <label style={{'float': 'none'}} className="input__label input__label-content">Facete</label>
            <Input valueLink={{value: this.props.term, requestChange: partial(this.props.onChange, 'term')}} label="Facete" effect="yoko" />
          </div>
        </div>

        <div className="edit-facete-terms">
          <label style={{'float': 'none'}} className="input__label input__label-content">Tags</label>
          <AutocompleteTagger delimiter="," limitSuggestions={10} suggestions={this.props.suggestions} tags={this.props.terms} onChange={partial(this.props.onChange, 'terms')} sortableContainer={process.env.BROWSER ? document.querySelector('.topic-pages-admin') : null} />
        </div>

        <div className={classNames('edit-facete-actions', {open: this.state.isSortable || recommended.length})}>
          {this.state.isSortable ? <div className="edit-facete-action-sort">
            <i className="fa fa-sort-alpha-asc" onClick={this.handleSort} />
          </div> : <span />}
          {recommended.length ? <div className="edit-facete-recommended" onClick={partial(this.appendTags, recommended)}>({recommended.length}) recommended tags</div> : <span />}
        </div>
      </div>
    ));
  }
});

export default dropTarget('facetes', draggableTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(dragSource('facetes', draggableSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))(DraggableFacete));
