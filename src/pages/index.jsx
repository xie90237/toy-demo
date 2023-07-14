import Image from 'next/image'
import '../app/globals.css'
import { useEffect, useMemo, useState } from 'react';
import { Button, Space, Modal } from 'antd';

import {sortableElement, sortableContainer} from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';

export default function Home() {
  
  const endTime = '23:00'
  const [planList, setPlanList] = useState([
    // 标签 优先级 时长 实际开始结束时间
    { label: '吃饭', priority: 1, duration: 30, start: '', end: '' },
    { label: '睡觉', priority: 1, duration: 30, start: '', end: '' },
  ]);
  const SortableItem = sortableElement(({children}) => (children));

  const SortableContainer = sortableContainer(({children}) => (children));
  
  const sortEnd = ({oldIndex, newIndex}) => {
    setPlanList(arrayMoveImmutable(planList, oldIndex, newIndex));
  };
  
  const [addVisible, setAddVisible] = useState(false);
  
  // 状态显示
  const StatusWrap = ({plan}) => {
    const { start, end } = plan;
    const currentTime = new Date().toLocaleTimeString().slice(0, 5);
    if (currentTime > start && currentTime < end) {
      return (
        <div className="mt-1 flex items-center gap-x-1.5">
          <div className="rounded-full animate-ping bg-emerald-500/20 p-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
          </div>
          <p className="text-xs leading-5 text-gray-500">进行中</p>
        </div>);
    }
    if (currentTime > end) {
      return (<p className="mt-1 text-xs leading-5 text-gray-500">已过期</p>);
    }
    return (<p className="mt-1 text-xs leading-5 text-gray-500">未开始</p>);
  }

  const formatDateTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${hours}:${minutes}`;
  };
  // 设置方案
  
  const setPlan = () => {
    const result = []
    const minutes = new Date().getMinutes();
    // 取十位数和这个的差值
    const diff = (10 - (minutes % 10)) * 60 *1000;
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    let totalTime = currentTime + diff;
    planList.forEach((item, index) => {
      const time = item.duration * 60 * 1000;
      totalTime += time;
      result.push({
        ...item,
        start: formatDateTime(totalTime - time ),
        end: formatDateTime(totalTime),
      });
    });
    setPlanList(result);
  }

  // 实时时间
  const [time, setTime] = useState(new Date().toLocaleString());
  
  const Head = () => {
    useEffect(() => {
      const timer = setInterval(() => {
        // 年月日时分秒
        setTime(new Date().toLocaleString());
      }, 1000);
      return () => {
        clearInterval(timer);
      }
    }, []);
    
    return (
      <div className='flex flex-col items-start'>
        <div className="text-base font-semibold leading-7 text-gray-900">{time}</div>
        <div className="mt-2 text-sm leading-6 text-gray-600 text-sm">
          休息时间: { endTime }
        </div>
        <div className='flex items-center justify-end w-full'>
          <Space wrap>
            <Button type="primary" onClick={() => setAddVisible(true)}>添加项</Button>
            <Button onClick={setPlan}>设置方案</Button>
          </Space>
        </div>
      </div>
    )
  }

  const handelAddPlan = () => {
    console.log('add plan');
  }

  return (<>
    <main className='flex flex-col max-w-screen-lg h-full mx-auto bg-white p-5'>
      <Head />
      <SortableContainer onSortEnd={sortEnd}>
        <ul role="list" className="divide-y divide-gray-100 w-full mt-2">
          {planList.map((item, index) => (
            <SortableItem key={`item-${index}`} index={index}>
              <li className="flex justify-between gap-x-6 py-2 px-4 shadow mt-2 rounded-lg">
                <div className="flex gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{ item.label }</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{item.start} - {item.end}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm leading-6 text-gray-900">时长: {item.duration} 分</p>
                  <StatusWrap plan={item} key={time} />
                </div>
              </li>
            </SortableItem>
          ))}
        </ul>
      </SortableContainer>
    </main>
    <Modal title="添加事件" open={addVisible} onOk={handelAddPlan} onCancel={() => setAddVisible(false)}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
  </>)
}
