import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {uniqueId, pick, partial} from 'lodash';

if (process.env.BROWSER) {
  require('styles/input.scss');
}

export default React.createClass({
  displayName: 'EditSlide',

  propTypes: {
    effect: PropTypes.string,
    value: PropTypes.string,
    valueLink: PropTypes.object,
    name: PropTypes.string,
    label: PropTypes.string
  },

  getDefaultProps() {
    return {
      effect: 'hoshi',
      label: '',
      value: ''
    };
  },

  getInitialState() {
    return {
      id: this.props.name ? this.props.name : uniqueId(),
      focused: false
    };
  },

  setFocus(focused) {
    this.setState(Object.assign(this.state, {focused}));
  },

  render() {
    let props = this.props;
    const value = props.valueLink ? props.valueLink.value : props.value;
    const onChange = props.valueLink ? (e) => props.valueLink.requestChange(e.target.value) : props.onChange;
    const klass = classNames(
      'input', 'input--' + props.effect, {
      'input--filled': (value.trim() || this.state.focused) && false
    });

    return (
      <span className={klass} {...pick(props, 'style')}>
        <input value={value} onChange={onChange} className={'input__field input__field--' + props.effect} id={this.state.id} onFocus={partial(this.setFocus, true)} onBlur={partial(this.setFocus, false)} />
        <label className={'input__label input__label--' + props.effect} htmlFor={this.state.id} data-content={props.label}>
          <span className={'input__label-content input__label-content--' + this.props.effect}>{props.label}</span>
        </label>
      </span>
    );
  }
});
