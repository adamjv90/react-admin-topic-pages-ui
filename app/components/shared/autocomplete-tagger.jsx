import React, {PropTypes} from 'react';
import {delay, partial, isEqual} from 'lodash';
import {hasClass} from 'utils/dom-class';

let horsey;
let insignia;
let dragula;

if (process.env.BROWSER) {
  require('styles/autocomplete-tagger.scss');

  horsey = require('horsey');
  insignia = require('insignia');
  dragula = require('react-dragula');
}

export default React.createClass({
  propTypes: {
    sortable: PropTypes.bool,
    tags: PropTypes.array,
    onChange: PropTypes.func,

    delimiter: PropTypes.string
  },

  getDefaultProps() {
    return {
      sortable: true,
      isSortableContainer() {
        return false;
      },
      sortablemoves(el) {
        return hasClass(el, 'nsg-tag');
      },
      sortableAccepts() {
        return true;
      },
      sortableInvalid() {
        return false;
      },
      sortableDirection: 'horizontal',
      sortableCopy: false,
      revertOnSpill: false,
      removeOnSpill: false,
      sortableContainer: process.env.BROWSER ? document.body : null,

      deletion: true,
      delimiter: ' ',
      renderTag(container, text) {
        container.innerText = container.textContent = text;
      },
      readTag(el) {
        return el.innerText || el.textContent;
      },
      parseTag(value) {
        return value.trim();
      },
      validateTag(value, tags) {
        return tags.indexOf(value) === -1;
      },
      convertOnFocus: false,

      // array of string or object, or function returning array
      suggestions: [],
      filterSuggestions: null,
      limitSuggestions: 3 / 0,
      getSuggestionText(suggestion) {
        return typeof suggestion === 'string' ? suggestion : suggestion.text;
      },
      getSuggestionValue(suggestion) {
        return typeof suggestion === 'string' ? suggestion : suggestion.value;
      },
      setSuggestion(el, value) {
        el.value = value;
      },
      anchorSuggestion: false,
      autoHideOnClick: true,
      autoHideOnBlur: true,
      autoShowOnUpDown: true,
      renderSuggestion(li, suggestion) {
        const props = this.props;
        li.innerText = li.textContent = props.getSuggestionText(suggestion);
      },
      appendSuggestionTo: process.env.BROWSER ? document.body : null,
      form: false
    };
  },

  componentDidMount() {
    this.init();
  },

  componentWillUnmount() {
    this.destroy();
  },

  shouldComponentUpdate() {
    return false;
  },

  componentWillReceiveProps(props) {
    if (!isEqual(props.tags, this.insignia.tags())) {
      const input = this.refs.input.getDOMNode();
      const value = input.value + '';

      this.destroy();
      input.value = props.tags.join(props.delimiter);
      this.init();

      if (value) {
        input.value = value;
      }
    }
  },

  init() {
    const input = this.refs.input.getDOMNode();
    const props = this.props;

    this.insignia = insignia(input, {
      deletion: props.deletion,
      delimiter: props.delimiter,
      render: props.renderTag,
      readTag: props.readTag,
      parse: props.parseTag,
      validate: props.validateTag,
      convertOnFocus: props.convertOnFocus
    });

    this.horsey = horsey(input, {
      suggestions: props.suggestions,
      filter: props.filterSuggestions,
      limit: props.limitSuggestions,
      getText: props.getSuggestionText,
      getValue: props.getSuggestionValue,
      set: partial(props.setSuggestion, input),
      anchor: props.anchorSuggestion,
      autoHideOnClick: props.autoHideOnClick,
      autoHideOnBlur: props.autoHideOnBlur,
      autoShowOnUpDown: props.autoShowOnUpDown,
      render: props.renderSuggestion.bind(this),
      appendTo: props.appendSuggestionTo,
      form: props.form
    });

    if (this.props.sortable) {
      this.dragula = dragula({
        containers: Array.prototype.slice.call(this.getDOMNode().querySelectorAll('.nsg-tags')),
        isContainer: props.isSortableContainer,
        moves: props.sortableMoves,
        accepts: props.sortableAccepts,
        invalid: props.sortableInvalid,
        direction: props.sortableDirection,
        copy: props.sortableCopy,
        revertOnSpill: props.revertOnSpill,
        removeOnSpill: props.removeOnSpill,
        mirrorContainer: props.sortableContainer
      });

      this.dragula.on('shadow', this.refreshPosition);
      this.dragula.on('dragend', this.handleEvaluated);
      this.dragula.on('drag', this.hideAutocomplete);
    }

    input.addEventListener('insignia-evaluated', this.handleEvaluated);
    input.addEventListener('insignia-evaluated', this.refreshPosition);
    input.addEventListener('horsey-selected', this.handleAutocompleteSelect);
  },

  destroy() {
    const input = this.refs.input.getDOMNode();

    this.insignia.destroy();
    this.horsey.destroy();

    if (this.dragula) {
      this.dragula.off('shadow', this.refreshPosition);
      this.dragula.off('dragend', this.handleEvaluated);
      this.dragula.off('drag', this.hideAutocomplete);
      this.dragula.destroy();
    }

    input.removeEventListener('insignia-evaluated', this.handleEvaluated);
    input.removeEventListener('insignia-evaluated', this.refreshPosition);
    input.removeEventListener('horsey-selected', this.handleAutocompleteSelect);
  },

  hideAutocomplete() {
    this.horsey.hide();
  },

  handleEvaluated() {
    // console.log(document.activeElement, this.refs.input.getDOMNode());
    this.props.onChange(this.insignia.tags());
  },

  handleAutocompleteSelect() {
    // console.log(arguments);
    // console.log('handle selected');
    this.insignia.convert();
    // console.log('after convert');
  },

  refreshPosition() {
    delay(() => {
      if (this.isMounted()) {
        this.horsey.refreshPosition();
      }
    }, 0);
  },

  render() {
    return (
      <div>
        <input ref="input" defaultValue={this.props.tags.join(this.props.delimiter)} />
      </div>
    );
  }

});
