import React from 'react';
import { animated, useTransition } from 'react-spring';

export default function AnimatedList({ items, component }: AnimatedListProps) {
  const transitions = useTransition(
    items,
    ({ id, choice_id }) => (choice_id ? `${id}` : id),
    {
      from: { transform: 'translateX(100%)', opacity: 0 },
      enter: { transform: 'translateX(0)', opacity: 1 },
      leave: { transform: 'translateX(100%)', opacity: 0 },
    }
  );
  return transitions.map(({ item, props, key }) => (
    <animated.div key={key} style={props}>
      {component(item)}
    </animated.div>
  ));
}

type Item = {
  id: string;
  choice_id?: 'present' | 'absent';
};
type AnimatedListProps = {
  items: Item[];
  component: React.FunctionComponent<Item>;
};
