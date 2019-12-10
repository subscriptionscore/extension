import { useEffect, useState } from 'react';
import { graphqlRequest } from '../utils/request';

function useGraphQl(query, options = {}) {
  const [state, setState] = useState({
    loading: true,
    value: null,
    error: null
  });

  useEffect(() => {
    setState({ loading: true });
    graphqlRequest(query, options)
      .then(response => {
        setState({ loading: false, value: response });
      })
      .catch(err => {
        setState({ loading: false, error: err });
      });
  }, [options, query]);

  return state;
}

useGraphQl.whyDidYouRender = true;
export default useGraphQl;
