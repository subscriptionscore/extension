import React, { useCallback, useMemo, useState } from 'react';

import Button from '../button';

const CopyButton = ({ children, string, ...btnProps }) => {
  const [isCopied, setCopied] = useState();

  const onClick = useCallback(() => {
    copyToClipboard(string);
    setCopied(true);
  }, [string]);

  const content = useMemo(() => {
    if (isCopied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
      return <span>Copied!</span>;
    }
    return children;
  }, [children, isCopied]);
  return (
    <Button {...btnProps} onClick={onClick}>
      {content}
    </Button>
  );
};

export default CopyButton;

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
