import React, {Component, PropTypes} from 'react/addons';

if (process.env.BROWSER) {
  require('styles/app.css');
}

class App extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired,
    children: PropTypes.element
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      i18n: props.flux
        .getStore('locale')
        .getState()
    };
  }

  componentDidMount() {
    this.props.flux
      .getStore('locale')
      .listen(this._handleLocaleChange);

    this.props.flux
      .getStore('page-title')
      .listen(this._handlePageTitleChange);
  }

  componentWillUnmount() {
    this.props.flux
      .getStore('locale')
      .unlisten(this._handleLocaleChange);

    this.props.flux
      .getStore('page-title')
      .unlisten(this._handlePageTitleChange);
  }

  _handleLocaleChange = (i18n) => {
    return this.setState({i18n});
  }

  _handlePageTitleChange({title}) {
    document.title = title;
  }

  renderChild = (child) => {
    return React.addons
      .cloneWithProps(child, {...this.state.i18n});
  }

  render() {
    return (
      <div>
        {
          React.Children
            .map(this.props.children, this.renderChild)
        }
      </div>
    );
  }

}

export default App;
