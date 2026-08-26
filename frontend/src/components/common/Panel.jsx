function Panel({ title, children }) {
  return (
    <div className="panel">

      <h2>
        {title}
      </h2>

      <div className="panel-content">
        {children}
      </div>

    </div>
  );
}

export default Panel;