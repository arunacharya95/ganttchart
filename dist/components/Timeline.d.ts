import React from 'react';
import { TimelineUnit } from '../types';
type TimelineProps = {
    units: TimelineUnit[];
    chartWidth: number;
    unitWidth: number;
};
declare const Timeline: React.FC<TimelineProps>;
export default Timeline;
