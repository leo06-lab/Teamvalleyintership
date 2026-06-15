function InlineMessage({ message }) {
  if (!message || !message.text) {
    return null;
  }

  const getIcon = () => {
    if (message.type === "success") return "✓";
    if (message.type === "error") return "!";
    if (message.type === "warning") return "!";
    return "i";
  };

  return (
    <div className={`inline-message inline-${message.type}`}>
      <span>{getIcon()}</span>
      <p>{message.text}</p>
    </div>
  );
}

export default InlineMessage;