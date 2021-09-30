import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      textAll: "0",
      text: "0"
    }
    this.handleNumber = this.handleNumber.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(event) {
    const evalue = event.key;
    const txt = this.state.text;
    const textAll = this.state.textAll;
    const equals = textAll.toString().indexOf('=');
    if(event.key.length === 1 || event.keyCode === 8){
      if(/[0-9]|\./.test(evalue)){
        this.handleNumber(evalue);
      } else if(/[*+/-]/.test(evalue)){
        this.handleOperator(evalue);
      }  else if(event.keyCode === 187){
        this.handleResult();
      } else if(event.keyCode === 8 && equals === -1 && Number(txt) !== 0){
        console.log(textAll.toString());
        this.setState(state => ({
              textAll: textAll.toString().slice(0, textAll.length -1),
              text: Number(txt.toString().slice(0, txt.length -1))
            }))  
        }
    }
  }

  handleNumber(event){
    const textAll = this.state.textAll;
    const lastChar = textAll[textAll.length-1];
    const equals = textAll.indexOf('=');
    const evalue = typeof event === 'string'? event: event.target.value;
    if(!(lastChar === '.' && evalue === '.')){
      if(equals === -1){
        if(/[+*/-]/.test(lastChar)){
          this.setState(state => ({
            textAll: state.textAll.concat(evalue),
            text: evalue
          }))
        } else {
          this.setState(state => ({
            textAll: state.textAll === '0'? evalue: state.textAll.concat(evalue),
            text: state.text === '0'? evalue: state.text.toString().concat(evalue)
          }))
        }
      }
    }
  }

  handleOperator(event){const textAll = this.state.textAll;
    const lastChar = textAll[textAll.length - 1];
    const equals = textAll.indexOf("=");
    const evalue = typeof event === 'string'? event: event.target.value;
    
    if (equals >= 0) {
      this.setState((state) => ({
        textAll: state.textAll
          .substring(equals + 1, state.textAll.length)
          .concat(evalue),
        text: evalue
      }));
      return;
    }
    
    if (/[+*/]/.test(lastChar) && evalue !== "-") {
      console.log("test1");
      this.setState({
        textAll: textAll.slice(0, textAll.length - 1).concat(evalue),
        text: evalue
      });
    } else if(lastChar === '-' && /[+*/]/.test(evalue)){
      console.log("test2");
      if(/[0-9]/.test(textAll[textAll.length-2])){
        this.setState((state) => ({
          textAll: textAll.substring(0, textAll.length-1).concat(evalue),
          text: evalue
        }));
      } else {
        this.setState((state) => ({
          textAll: textAll.substring(0, textAll.length-2).concat(evalue),
          text: evalue
        }));
      }
    } else {
      if (!(lastChar === ".")) {
        this.setState((state) => ({
          textAll: state.textAll === "0" && evalue === "-"? evalue: state.textAll.concat(evalue),
          text: evalue
        }));
      }
    }
  }

  handleResult(){
    let textAll = this.state.textAll.replace(/([+-/*])(0+)([1-9])/g, "$1$3");
    const equals = textAll.indexOf('=');
    const result = eval(textAll);
    const fixedDecimal = ((result % 1).toString().length > 12)? result.toFixed(12): result;

    if (equals < 0) {
      textAll = textAll.replace(/([+-/*])(0{2,})$/g, "$10");
      textAll = textAll.replace(/-{2,}/g, "+");
      if (!/[/*+-]/.test(textAll[textAll.length - 1])) {
        this.setState((state) => ({
          textAll: state.textAll.concat("=" + fixedDecimal),
          text: fixedDecimal
        }));
      }
    }    
  }

  handleClear(){
    this.setState({
      textAll:'0',
      text: '0'
    })
  }

  render() {
    return (
      <div className="wrapper">
        <Display
          textAll={this.state.textAll}
          text={this.state.text}
        />
        <Buttons 
          handleNumber = {this.handleNumber}
          handleOperator = {this.handleOperator}
          handleResult = {this.handleResult} 
          handleClear = {this.handleClear}
          />
      </div>
    );
  }
}


const Display = (props) => {
    return (
      <div className="display">
        <div className="total" id="display">{props.textAll}</div>
        <div className="inputText" >{props.text}</div>
      </div>
    )
  }

const Buttons = (props) => {
  return (
    <div className="btn">
      <div className="left-btn">
        <button className="btn-number" id="nine" value="9" onClick={props.handleNumber}>9</button>
        <button className="btn-number" id="eight" value="8" onClick={props.handleNumber}>8</button>
        <button className="btn-number" id="seven" value="7" onClick={props.handleNumber}>7</button>
        <button className="btn-number" id="six" value="6" onClick={props.handleNumber}>6</button>
        <button className="btn-number" id="five" value="5" onClick={props.handleNumber}>5</button>
        <button className="btn-number" id="four" value="4" onClick={props.handleNumber}>4</button>
        <button className="btn-number" id="three" value="3" onClick={props.handleNumber}>3</button>
        <button className="btn-number" id="two" value="2" onClick={props.handleNumber}>2</button>
        <button className="btn-number" id="one" value="1" onClick={props.handleNumber}>1</button>
        <button className="btn-number last" id="zero" value="0" onClick={props.handleNumber}>0</button>
        <button className="btn-number" id="decimal" value="." onClick={props.handleNumber}>.</button>
      </div>
      <div className="right-btn">
        <button className="btn-operation" id="clear" onClick={props.handleClear}>AC</button>
        <button className="btn-operation" id="add" value="+" onClick={props.handleOperator}>+</button>
        <button className="btn-operation" id="subtract" value="-" onClick={props.handleOperator}>-</button>
        <button className="btn-operation" id="multiply" value="*" onClick={props.handleOperator}>X</button>
        <button className="btn-operation" id="divide" value="/" onClick={props.handleOperator}>/</button>
        <button className="btn-operation" id="equals" onClick={props.handleResult}>=</button>
      </div>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);