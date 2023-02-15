import { useState } from "react";
import { calculateOutput } from "./robots";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  function handleInputTextChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setInputText(event.currentTarget.value);
  }

  function handleButtonClick() {
    setInputText("");
    setOutputText(calculateOutput(inputText));
  }

  return (
    <div>
      <h1>Martian Robots</h1>
      <label>Robot instructions (Input)</label>
      <textarea
        name="input"
        value={inputText}
        onChange={handleInputTextChange}
      />
      <button onClick={handleButtonClick}>Process instructions</button>
      <p>Add robot instructions in the input box and click the button</p>
      {outputText && (
        <>
          <h2>Output</h2>
          <p>{outputText}</p>
        </>
      )}
    </div>
  );
}

export default App;
