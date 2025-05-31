/* eslint-disable no-mixed-operators */
import classNames from 'classnames';
import moment from 'moment';
import { ChangeEvent, useEffect, useState } from 'react';

function RangeSlider({
  startDate,
  min = 0,
  max,
  onSelectTimeRange,
  minValue = 0,
  maxValue = 0,
}: {
  startDate?: Date | string;
  min?: number;
  max: number;
  minValue?: number;
  maxValue?: number;
  onSelectTimeRange: ({ start_date, end_date }: {
    start_date: string, end_date: string }) => void;
}) {
  const [ formData, setFormData ] = useState<{ from: string, to: string }>({
    from: '0',
    to: '0',
  });
  const [ controlSliderBg, setControlSliderBg ] = useState<string>('');
  const [ currentDate, setCurrentDate ] = useState<number>(0); // day

  const calculateTooltipPosition = (value: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `calc(${percentage}% + (${8 - percentage * 0.15}px))`;
  };

  const fillSlider = (from: number, to: number) => {
    const sliderColor = '#C6C6C6';
    const rangeColor = '#19BED4';

    const rangeDistance = max; // to max - to min
    const fromPosition = from - 0; // from value - to min
    const toPosition = to - 0; // to value - to min

    const style = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%,
      ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%,
      ${sliderColor} 100%)`;
    setControlSliderBg(style);
  };

  const handleFromSliderInput = ({ target }: ChangeEvent<HTMLInputElement> | any) => {
    setFormData((s: any) => ({
      ...s,
      [target.name]: target.value,
    }));
    setCurrentDate(+target.value);

    const from = +target.value;
    const to = +formData.to;

    fillSlider(from, to);

    if (from > to) {
      setFormData(prevFormData => ({
        ...prevFormData,
        from: `${to}`,
      }));
    }
  };

  const handleToSliderInput = ({ target }: ChangeEvent<HTMLInputElement> | any) => {
    setFormData((s: any) => ({
      ...s,
      [target.name]: target.value,
    }));
    setCurrentDate(+target.value);

    const from = +formData.from;
    const to = +target.value;

    fillSlider(from, to);

    setFormData(prevFormData => ({
      ...prevFormData,
      to: from <= to ? `${to}` : `${from}`,
    }));
  };

  const loadData = () => {
    handleFromSliderInput({
      target: {
        name: 'from',
        value: minValue.toString(),
      },
    });
    handleToSliderInput({
      target: {
        name: 'to',
        value: maxValue.toString(),
      },
    });
  };

  const handleSelect = () => {
    onSelectTimeRange({
      start_date: moment(startDate).startOf('day').add(formData.from, 'days').toISOString(),
      end_date: moment(startDate).endOf('day').add(formData.to, 'days').toISOString(),
    });
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ minValue, maxValue ]);

  return (
    <div className="range-slider-container">
      <div className="sliders-control d-flex align-items-center">
        <input
          id="fromSlider"
          className="custom-from-slider"
          type="range"
          name="from"
          value={formData.from}
          min="0"
          max={`${max}`}
          onChange={handleFromSliderInput}
          onMouseUp={handleSelect}
          onTouchEnd={handleSelect}
        />
        <input
          id="toSlider"
          className={classNames('custom-to-slider', {
            show: +formData.to <= 0,
          })}
          style={{
            background: controlSliderBg,
          }}
          type="range"
          name="to"
          value={formData.to}
          min="0"
          max={`${max}`}
          onChange={handleToSliderInput}
          onMouseUp={handleSelect}
          onTouchEnd={handleSelect}
        />
      </div>
      <div className="tooltip" style={{ left: calculateTooltipPosition(currentDate) }}>
        {moment(startDate).add(currentDate, 'days').format('MMM DD, YYYY')}
      </div>
    </div>
  );
}

export default RangeSlider;
