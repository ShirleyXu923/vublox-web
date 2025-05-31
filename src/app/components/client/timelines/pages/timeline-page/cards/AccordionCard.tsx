import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';

import sample from '@assets/img/sample.png';
import LocaleService from '@services/LocaleService';
import { dateToCalendar } from '@shared/helpers';
import { ArrowDownIcon } from '@shared/icons';
import TimelineIcon from '@shared/icons/TimelineIcon';

import ChildCard from './ChildCard';
import DescriptiveCard from './DescriptiveCard';
import Pin from '../components/Pin';

interface AccordionCardProps {
  timeblock: any;
  isLast: boolean;
}

function AccordionCard({ timeblock, isLast }: AccordionCardProps) {
  const i18n = LocaleService.getTranslations('timelinePage');
  const params = useParams();
  const ref = useRef<any>(null);
  const [ height, setHeight ] = useState<number>(0);
  const [ showChildren, setShowChildren ] = useState(false);
  const [ open, setOpen ] = useState('');
  const toggle = () => {
    if (open !== timeblock?.id) {
      setOpen(timeblock?.id);
    } else {
      setOpen('');
    }
  };

  useEffect(() => {
    setHeight(ref.current?.clientHeight);
  }, [ open ]);

  return (
    <div className={`timeline-item ${isLast ? 'last-item' : ''}`}>
      <Pin withExtender height={height} />
      <div className="card-wrapper">
        <Accordion open={open} toggle={toggle}>
          <AccordionItem>
            <AccordionHeader targetId={timeblock?.id}>
              <div className="accordion-card" ref={ref}>
                <div className="header">
                  <div className="b6">{dateToCalendar(timeblock?.started_at)}</div>
                  <div className="arrow" onClick={() => setShowChildren(!showChildren)}>
                    <ArrowDownIcon />
                  </div>
                </div>
                <div className="body">
                  <img className="image" width={116} height={46} src={sample} alt="" />
                  <div className="informative">
                    <div className="b2">
                      <Link to={`/timelines/${timeblock?.id}/${params?.id}`}>{timeblock?.name}</Link>
                    </div>
                    <div className="b5 text-truncate" style={{ maxWidth: '700px' }}>{timeblock?.description}</div>
                    <div className="caption1">{timeblock?.location?.name}</div>
                  </div>
                </div>
                <div className="actions">
                  <div className="badges">
                    <TimelineIcon />
                    <span className="badge1">{i18n.label.timeline}</span>
                  </div>
                </div>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId={timeblock?.id}>
              <div className="children">
                <ChildCard open={open} />
                <DescriptiveCard open={open} />
                <ChildCard open={open} />
              </div>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default AccordionCard;
