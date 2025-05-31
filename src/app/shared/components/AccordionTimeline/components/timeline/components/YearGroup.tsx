import React, { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';

import { ArrowDownIcon } from '@shared/icons';

import CardItem from './CardItem';
import { Pin } from './pin';

interface YearGroupProps {
  title: string;
  items: any[];
}

function YearGroup({ title, items }: YearGroupProps) {
  const ref = useRef<any>(null);
  const [ height, setHeight ] = useState(0);
  const [ open, setOpen ] = useState('');
  const [ , setIsClosedManually ] = useState(false);
  const toggle = () => {
    document.onscroll = null;
    setIsClosedManually(true);
    if (open !== title) {
      setOpen(title);
    } else {
      setOpen('');
    }
  };

  const translateMonth = (month: string) => {
    let returanbleMonth = 'Jan';

    switch (month) {
      case '1':
        returanbleMonth = 'Jan';
        break;
      case '2':
        returanbleMonth = 'Feb';
        break;
      case '3':
        returanbleMonth = 'Mar';
        break;
      case '4':
        returanbleMonth = 'Apr';
        break;
      case '5':
        returanbleMonth = 'May';
        break;
      case '6':
        returanbleMonth = 'Jun';
        break;
      case '7':
        returanbleMonth = 'Jul';
        break;
      case '8':
        returanbleMonth = 'Aug';
        break;
      case '9':
        returanbleMonth = 'Sep';
        break;
      case '10':
        returanbleMonth = 'Oct';
        break;
      case '11':
        returanbleMonth = 'Nov';
        break;
      case '12':
        returanbleMonth = 'Dec';
        break;
      default:
        break;
    }

    return returanbleMonth;
  };

  const translateHours = (hours: any, minutes: any) => {
    const intHours = hours;
    const meridian = intHours > 11 ? 'PM' : 'AM';
    let newHours = hours;
    if (intHours === 0) {
      newHours = '12';
    }

    if (intHours < 10 && intHours !== 0) {
      newHours = `0${hours}`;
    }

    if (intHours > 12 && intHours < 22) {
      newHours = `0${intHours - 12}`;
    }

    if (intHours > 12 && intHours > 21) {
      newHours = `${intHours - 12}`;
    }

    return `${newHours}:${minutes ?? '00'} ${meridian}`;
  };

  const getTitle = () => {
    const [ year, month, hours, minutes ] = title.split('-');
    let returnableTitle = year;

    if (hours || minutes) {
      returnableTitle = `${returnableTitle}, ${translateMonth(month)} at ${translateHours(hours, minutes)}`;
    } else if (month) {
      returnableTitle = `${returnableTitle}, ${translateMonth(month)}`;
    }

    return returnableTitle;
  };

  const handleScroll = () => {
    const isAtBottom = Math.ceil(window.innerHeight + window.scrollY)
      >= document.documentElement.scrollHeight;
    if (isAtBottom) {
      setOpen(title);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      document.onscroll = handleScroll;
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ open ]);

  useEffect(() => {
    setHeight(ref.current?.clientHeight);
    document.onscroll = handleScroll;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Accordion
      toggle={toggle}
      open={open}
    >
      <AccordionItem>
        {/* This is year accordion */}
        <AccordionHeader targetId={title}>
          <div className="timeline-item">
            {/* Pin Design */}
            <Pin height={height} />
            {/* Accordion Button */}
            <div className="accordion-cs" ref={ref}>
              <div className="arrow">
                <ArrowDownIcon />
              </div>
              <div className="s3">{getTitle()}</div>
            </div>
          </div>
        </AccordionHeader>

        {/* This is for the timeline card accordion */}
        <AccordionBody accordionId={title}>
          {items.length > 0 && (
            <React.Fragment>
              {items.map((item: any, index: number) => (
                <CardItem
                  key={item?.id || item?.type}
                  item={item}
                  open={open}
                  list={items}
                  currentIndex={index}
                />
              ))}
            </React.Fragment>
          )}
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
}

export default YearGroup;
