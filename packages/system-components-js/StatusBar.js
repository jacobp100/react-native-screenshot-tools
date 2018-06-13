import { Component } from "react";

const delegates = new Set();
const propsStack = [];

const updatePropsStack = () => {
  delegates.forEach(d => d.forceUpdate());
};

export default class StatusBar extends Component {
  stackEntry = null;

  static Consumer = class Consumer extends Component {
    constructor() {
      super();
      delegates.add(this);
    }

    componentWillUnmount() {
      delegates.delete(this);
    }

    render() {
      const props = Object.assign({}, ...propsStack);
      return this.props.children(props);
    }
  };

  componentDidMount() {
    this.stackEntry = this.props;
    propsStack.push(this.stackEntry);
    updatePropsStack();
  }

  componentWillUnmount() {
    const index = propsStack.indexOf(this.stackEntry);
    propsStack.splice(index, 1);
    updatePropsStack();
  }

  componentDidUpdate() {
    const index = propsStack.indexOf(this.stackEntry);
    this.stackEntry = this.props;
    propsStack[index] = this.stackEntry;
    updatePropsStack();
  }

  // eslint-disable-next-line
  render() {
    return null;
  }
}
