/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

export const createTimelineAction = createAction('VUBLOX_TIMELINE_CREATE_TIMELINE');
export const updateTimelineAction = createAction('VUBLOX_TIMELINE_UPDATE_TIMELINE');
export const publishTimelineAction = createAction('VUBLOX_TIMELINE_PUBLISH_TIMELINE');
export const unPublishTimelineAction = createAction('VUBLOX_TIMELINE_UNPUBLISH_TIMELINE');
export const uploadImageAction = createAction('VUBLOX_TIMELINE_UPLOAD_IMAGE');
export const moveTimelineCardAction = createAction('VUBLOX_TIMELINE_MOVE_TIMELINE_CARD');
export const getTimelineAction = createAction('VUBLOX_TIMELINE_GET_TIMELINE');
export const getTimelineTimelineAction = createAction('VUBLOX_TIMELINE_GET_TIMELINE_TIMELINE');
export const searchTimelineAction = createAction('VUBLOX_TIMELINE_SEARCH_TIMELINE');
export const createTimelineTimeblockAction = createAction('VUBLOX_TIMELINE_CREATE_TIMEBLOCK');
export const getTimelineTimeblockablesAction = createAction('VUBLOX_TIMELINE_GET_TIMEBLOCKABLES');
export const getTimelinesAction = createAction('VUBLOX_TIMELINE_GET_TIMELINES');
export const getMyTimelinesAction = createAction('VUBLOX_TIMELINE_GET_MY_TIMELINES');
export const getFeaturedTimelinesAction = createAction('VUBLOX_TIMELINE_GET_FEATURED_TIMELINES');
export const getTimeblockablesAction = createAction('VUBLOX_TIMELINE_GET_TIMEBLOCKABLES_ACTION');
export const deleteTimeblockableAction = createAction('VUBLOX_TIMELINE_DELETE_TIMEBLOCKABLE_ACTION');
export const getWorldTimelineAction = createAction('VUBLOX_TIMELINE_GET_WORLD_TIMELINE');
export const contributeToTimelineAction = createAction('VUBLOX_CONTRIBUTE_TO_TIMELINE');
