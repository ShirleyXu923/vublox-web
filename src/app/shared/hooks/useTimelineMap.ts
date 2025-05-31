import { useCallback, useState } from 'react';

export default function useTimelineMap() {
  const [ markers, setMarkers ] = useState<any[]>([]);
  const [ startDate, setStartDate ] = useState<Date>(new Date());
  const [ endDate, setEndDate ] = useState<Date>(new Date());

  const setTimelineMarkers = useCallback((items: any[]) => {
    setMarkers(items?.[0]?.items?.map?.((i: any) => ({ ...(i.type === 'Organization.Location' ? i.data?.location : i.data), page_type: i.type === 'Organization.Location' ? 'Location' : i.type }))
      ?.filter((i: any) => (i.latitude && i.longitude) || i.location) || []);
  }, []);

  const setVisibleTimelineMarkers = useCallback((visible: boolean, items: any) => {
    if (Array.isArray(items)) {
      if (items.length === 0 && !visible) return;

      setMarkers(items.map((e: any) => ({ ...(e.type === 'Organization.Location' ? e.data?.location : e.data), page_type: e.type === 'Organization.Location' ? 'Location' : e.type }))
        .filter((i: any) => (i.latitude && i.longitude) || i.location) || []);
      return;
    }

    setMarkers(m => {
      if (!items.data.latitude && !items.data.longitude && !items.data.location) return m;

      const itemIds = m.map((i: any) => i.data?.id || i.id);
      if (visible) {
        return m.find((i: any) => itemIds.includes(i.data?.id || i.id)) ? m : [ ...m, {
          ...(items.type === 'Organization.Location' ? items.data?.location : items.data), page_type: items.type === 'Organization.Location' ? 'Location' : items.type,
        } ];
      }

      return m.filter((i: any) => !itemIds.includes(i.data?.id || i));
    });
  }, []);

  const setDates = useCallback((start: Date | string, end: Date | string) => {
    setStartDate(new Date(start));
    setEndDate(new Date(end));
  }, []);

  return {
    markers,
    startDate,
    endDate,
    setDates,
    setTimelineMarkers,
    setVisibleTimelineMarkers,
  };
}
