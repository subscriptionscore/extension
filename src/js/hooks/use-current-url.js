import useBackground from './use-background';

export default () => {
  const { loading, value: url } = useBackground('get-current-url');
  return { loading, url };
};
