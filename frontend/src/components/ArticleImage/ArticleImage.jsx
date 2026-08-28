import { useState } from "react";

function ArticleImage({ alt, className, src }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    <img
      alt={alt || ""}
      className={className || ""}
      onError={() => setFailed(true)}
      src={src}
    />
  );
}

export default ArticleImage;
