import React, {PropTypes} from 'react';
import update from 'react/lib/update';
import {partial, map, sortBy, findWhere, indexOf} from 'lodash';
import Input from 'components/shared/input';
import EditFacete from 'components/partials/edit-facete';

import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import {DragDropContext} from 'react-dnd';

const dragDropContext = DragDropContext;

const EditFacetes = React.createClass({
  displayName: 'EditFacetes',

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    facetes: PropTypes.object,
    suggestions: PropTypes.array,
    recommended: PropTypes.object,
    onSave: PropTypes.func,
    onCancel: PropTypes.func
  },

  getInitialState() {
    return {
      facetes: sortBy(this.props.facetes, 'position'),
      facete: ''
    };
  },

  componentWillReceiveProps(props) {
    this.setState(Object.assign(this.state, {facetes: sortBy(props.facetes, 'position')}));
  },

  createFacete(term) {
    this.setState(Object.assign(this.state, {facetes: sortBy(update(this.state.facetes, {
      $unshift: [{
        term: term,
        terms: []
      }]
    }), 'position')}));
  },

  removeFacete(index) {
    this.setState(update(this.state, {
      facetes: {
        $splice: [[index, 1]]
      }
    }));
  },

  handleCreate(e) {
    e.preventDefault();
    this.createFacete(this.state.facete);
    this.setState({facete: ''});
  },

  handleChange(i, attribute, value) {
    this.setState(update(this.state, {
      facetes: {
        $splice: [[i, 1, update(this.state.facetes[i], {
          [attribute]: {
            $set: value
          }
        })]]
      }
    }));
  },

  handleSave() {
    this.props.onSave(this.state.facetes);
  },

  handleSort(term, afterTerm) {
    const facetes = this.state.facetes;
    const position = indexOf(facetes, findWhere(facetes, {term: term}));
    const after = indexOf(facetes, findWhere(facetes, {term: afterTerm}));

    this.setState(Object.assign(this.state, {facetes: map(update(facetes, {
      $splice: [[position, 1], [after, 0, facetes[position]]]
    }), (facete, i) => {
      return Object.assign(facete, {position: i});
    })}));
  },

  render() {
    return (
      <div className="inner">
        <div className="edit-facetes edit-content">
          {map(this.state.facetes, (facete, i) => <EditFacete {...facete} suggestions={this.props.suggestions} recommended={this.props.recommended} onRemove={partial(this.removeFacete, i)} onChange={partial(this.handleChange, i)} onSort={this.handleSort} />)}
        </div>
        <div className='edit-facetes-toolbar edit-toolbar'>
          <form onSubmit={this.handleCreate}>
            <Input valueLink={this.linkState('facete')} label="New Facete" effect="yoko" />
          </form>
          <div className="edit-facetes-actions edit-actions">
            <span className="btn" onClick={this.handleSave}>Save</span>
            <span className="btn cancel red" onClick={this.props.onCancel}>Cancel</span>
          </div>
        </div>
      </div>
    );
  }
});

export default dragDropContext(HTML5Backend)(EditFacetes);
