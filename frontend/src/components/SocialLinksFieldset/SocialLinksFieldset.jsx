function SocialLinksFieldset({ links, onChange }) {
  const updateRow = (index, field) => (e) => {
    const next = links.map((link, i) =>
      i === index ? { ...link, [field]: e.target.value } : link
    );
    onChange(next);
  };

  const removeRow = (index) => () => {
    onChange(links.filter((_, i) => i !== index));
  };

  const addRow = () => onChange([...links, { label: "", url: "" }]);

  return (
    <fieldset className="form-group social-links-fieldset">
      {links.map((link, index) => (
        <div className="social-link-row" key={index}>
          <input
            className="form-control"
            onChange={updateRow(index, "label")}
            placeholder="Label (e.g. GitHub)"
            value={link.label}
          />
          <input
            className="form-control"
            onChange={updateRow(index, "url")}
            placeholder="URL"
            value={link.url}
          />
          <button onClick={removeRow(index)} type="button">
            Remove
          </button>
        </div>
      ))}
      <button onClick={addRow} type="button">
        Add a link
      </button>
    </fieldset>
  );
}

export default SocialLinksFieldset;
