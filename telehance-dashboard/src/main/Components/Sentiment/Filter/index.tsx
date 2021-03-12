import React from 'react';
// import clsx from 'clsx';
// import { Option, ButtonIcon } from 'react-rainbow-components';
// // @ts-ignore
// import InternalDropdown from 'react-rainbow-components/components/InternalDropdown';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowDown, faCircle } from '@fortawesome/free-solid-svg-icons';
// import { ConsultData } from 'Models';
import classes from './Filter.module.css';

// const DefaultThreshold: { [key: string]: number } = {
//   FLIRTATION: 0.75,
//   IDENTITY_ATTACK: 0.75,
//   INSULT: 0.75,
//   PROFANITY: 0.75,
//   THREAT: 0.75,
//   TOXICITY: 0.75,
// };

// const attributes: { [key: string]: string } = {
//   FLIRTATION: '#e83e8c',
//   IDENTITY_ATTACK: '#007bff',
//   INSULT: '#ffee58',
//   NO_ISSUES: '#28a745',
//   PROFANITY: '#e65100',
//   THREAT: '#dc3545',
//   TOXICITY: '#6f42c1',
//   UNRATED: '#6c757d',
// };

// function getLabel(attribute: string) {
//   const lowercase = attribute.toLowerCase().split('_');
//   return lowercase
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// }

// function onFilter(filterVal: any, data: ConsultData[]) {
//   if (!filterVal || filterVal.length === 0) return data;

//   return data.filter(({ sentiment }) => {
//     let matchesOneFilter = false;
//     filterVal.forEach(({ name }: any) => {
//       if (sentiment === undefined) {
//         if (name === 'UNRATED') matchesOneFilter = true;
//         return;
//       }
//       if (name === 'NO_ISSUES') {
//         matchesOneFilter =
//           matchesOneFilter ||
//           Object.entries(sentiment).every(
//             ([attribute, score]) => score < DefaultThreshold[attribute]
//           );
//       } else {
//         matchesOneFilter =
//           matchesOneFilter || sentiment[name] >= DefaultThreshold[name];
//       }
//     });
//     return matchesOneFilter;
//   });
// }

// export default function Filter({ setDisplayConsult, consults }: any) {
//   const [show, setShow] = useState(false);
//   const [value, setValue] = useState();

//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setDisplayConsult(onFilter(value, consults));
//   }, [setDisplayConsult, consults, value]);

//   function checkShouldShow(event: any) {
//     if (!ref?.current?.contains(event.target)) {
//       setShow(false);
//     }
//   }

//   useEffect(() => {
//     document.addEventListener('click', checkShouldShow);
//     return () => {
//       document.removeEventListener('click', checkShouldShow);
//     };
//   }, []);

//   return (
//     <div className={classes.container} ref={ref}>
//       <span>Issues</span>

//     </div>
//   );
// }

export default function Filter() {
  return (
    <div className={classes.container}>
      <span>Issues</span>
    </div>
  );
}
