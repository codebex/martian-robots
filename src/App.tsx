import { useState } from "react";
import { calculateOutput } from "./robots";

function App() {
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState<string[]>([]);

  function handleInputTextChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setInputText(event.currentTarget.value);
  }

  function handleButtonClick() {
    setOutput(calculateOutput(inputText));
    setInputText("");
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
      {output && (
        <>
          <h2>Output</h2>
          {output.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
