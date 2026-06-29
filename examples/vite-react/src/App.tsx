export function App() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 560 }}>
      <h1>ui-error-snapshot · Vite example</h1>
      <p>Click the button to throw an uncaught error. Then run:</p>
      <pre>npm run check:ui-error-snapshot</pre>
      <button
        type="button"
        onClick={() => {
          throw new RangeError("1/0");
        }}
      >
        Trigger red-screen error
      </button>
    </main>
  );
}
