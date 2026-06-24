export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}
