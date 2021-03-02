import React from 'react';
import { animated, useTransition } from 'react-spring';

export default function AnimatedList({ items, component }: CardListProps) {
  const transitions = useTransition(items, (item) => item.id, {
    from: { transform: 'translateX(100%)', opacity: 0 },
    enter: { transform: 'translateX(0)', opacity: 1 },
    leave: { transform: 'translateX(100%)', opacity: 0 },
  });
  return transitions.map(({ item, props, key }) => (
    <animated.div key={key} style={props}>
      {component(item)}
    </animated.div>
  ));
}

type Item = {
  id: string;
};
type CardListProps = {
  items: Item[];
  component: React.FunctionComponent<Item>;
};
