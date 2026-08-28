// The app uses react-router-dom's HashRouter (see main.jsx), which treats
// the entire URL fragment as its route. A plain `href="#id"` click changes
// `window.location.hash`, which HashRouter reads as a navigation to a
// (nonexistent) route "id" rather than a same-page anchor jump - blanking
// the whole article page instead of scrolling. Handling the click directly
// and scrolling the target into view keeps the hash (and the route) alone.
function handleClick(id) {
  return (event) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView();
  };
}

function ArticleTableOfContents({ headings }) {
  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents" className="article-toc">
      <ul>
        {headings.map(({ id, level, text }) => (
          <li className={`toc-level-${level}`} key={id}>
            <a href={`#${id}`} onClick={handleClick(id)}>
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ArticleTableOfContents;
