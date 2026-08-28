const UNSAFE_URL_SCHEME = /^\s*(javascript|data|vbscript):/i;

function isSafeUrl(url) {
  return !UNSAFE_URL_SCHEME.test(url);
}

export default isSafeUrl;
