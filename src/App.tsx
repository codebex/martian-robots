import { useState } from "react";
import { calculateOutput } from "./output-calculation/calculation";

function App() {
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState<string[] | null>(null);

  function handleInputTextChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setInputText(event.currentTarget.value);
  }

  function handleButtonClick() {
    setOutput(calculateOutput(inputText));
  }

  return (
    <main>
      <h1>Martian Robots</h1>
      <label htmlFor="input">Input</label>
      <textarea
        name="input"
        id="input"
        value={inputText}
        onChange={handleInputTextChange}
      />
      <button
        type="button"
        name="calculate-output"
        onClick={handleButtonClick}
        disabled={!inputText}
      >
        Get output
      </button>
      {output && (
        <>
          <h2>Output</h2>
          {output.length ? (
            output.map((text, i) => <p key={i}>{text}</p>)
          ) : (
            <p>No output for the above text</p>
          )}
        </>
      )}
    </main>
  );
}

export default App;
