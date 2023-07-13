import Image from 'next/image'
import styles from './index.scss'
import { useEffect, useMemo, useState } from 'react';

import {sortableElement, sortableContainer} from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';

export default function Home() {
  const [datalist, setDatalist] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']);

  const SortableItem = sortableElement(({value}) => (<li>{value}</li>));

  const SortableContainer = sortableContainer(({children}) => {
    return (
      <ul>
        {children}
      </ul>
    );
  });

  const sortEnd = ({oldIndex, newIndex}) => {
    setDatalist(arrayMoveImmutable(datalist, oldIndex, newIndex));
  };
  
  return (<>
    <div className='home-wrap'>
      <div className="title"></div>
      <div className="sub-head">
        <div className="sub-head__left">
          <div className="sub-head__left__title">Sub Head Title</div>
        </div>
        <div className="sub-head__right">
          <div className="sub-head__right__title">Sub Head Title</div>
        </div>
      </div>

    <SortableContainer onSortEnd={sortEnd}>
        {datalist.map((value, index) => (
          <SortableItem key={`item-${value}`} index={index} value={value}>
          </SortableItem>
        ))}
      </SortableContainer>
    </div>
  </>)
}
