import { useRoute } from '@react-navigation/native';

const withUniqueKey = (Component) => {
  return (props) => {
    const route = useRoute();
    const key = `${route.name}-${JSON.stringify(route.params)}`;

    return <Component key={key} {...props} />;
  };
};

export default withUniqueKey;
