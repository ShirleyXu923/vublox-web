// NOTE: Dependency cycle are needed for the children components to work in the timeline component.
/* eslint-disable import/no-cycle */
import { EventCard } from '../cards/event-card';
import GoalCard from '../cards/game-cards/GoalCard';
import OwnGoalCard from '../cards/game-cards/OwnGoalCard';
import PenaltyGoalCard from '../cards/game-cards/PenaltyGoalCard';
import PenaltyMissedCard from '../cards/game-cards/PenaltyMissedCard';
import PenaltyShootoutCard from '../cards/game-cards/PenaltyShootoutCard';
import RedCard from '../cards/game-cards/RedCard';
import SubstitutionCard from '../cards/game-cards/SubstitutionCard';
import YellowCard from '../cards/game-cards/YellowCard';
import GroupCard from '../cards/group-card/GroupCard';
import { Bio } from '../cards/organization/bio';
import { CoverPhoto } from '../cards/organization/cover-photo';
import { Location } from '../cards/organization/location';
import { Logo } from '../cards/organization/logo';
import { Name } from '../cards/organization/name';
import { PostCard } from '../cards/post-card';
import PostGroupCard from '../cards/post-group-card/PostGroupCard';
import { TimelineCard } from '../cards/timeline-card';

interface DataTypeProps {
  type: string;
  data: any;
}

export default function useCards(
  dataType: DataTypeProps,
  open: any,
  list: any[],
  currentIndex: number,
  onChangeVisibleItems?: ((isVisible: boolean, items: any[]) => void),
  onClick?: (e: any, item: any, type: string) => void,
  query?: any,
) {
  const type = dataType?.type;
  const data = dataType?.data;
  let component = null;
  let hasExtender = false;

  // Check if it is the first one or else check if the previous card have a children
  if (currentIndex !== 0) {
    hasExtender = true;
  }

  if (type === 'Timeline') {
    component = (
      <TimelineCard {...data} hasExtender={hasExtender} />
    );
  }

  if (type === 'Event') {
    component = (
      <EventCard {...data} open={open} hasExtender={hasExtender} />
    );
  }

  if (type === 'Group') {
    component = (
      <GroupCard
        open={open}
        hasExtender={hasExtender}
        {...dataType as any}
        onChangeVisibleItems={onChangeVisibleItems}
        onClick={onClick}
        query={query}
      />
    );
  }

  if (type === 'PostGroup') {
    component = (
      <PostGroupCard
        open={open}
        hasExtender={hasExtender}
        {...data}
      />
    );
  }

  if (type === 'Post') {
    component = (
      <PostCard {...data} hasExtender={hasExtender} />
    );
  }

  if (type === 'Organization.Name') {
    component = (
      <Name {...data} />
    );
  }

  if (type === 'Organization.Logo') {
    component = (
      <Logo {...data} />
    );
  }

  if (type === 'Organization.CoverPhoto') {
    component = (
      <CoverPhoto {...data} />
    );
  }

  if (type === 'Organization.Bio') {
    component = (
      <Bio {...data} />
    );
  }

  if (type === 'Organization.Location' && data?.id) {
    component = (
      <Location {...data} />
    );
  }

  if (type === 'goal' || type === 'score_change') {
    component = (
      <GoalCard hasExtender={hasExtender} {...dataType as any} />
    );
  }

  if (type === 'yellow_card') {
    component = (
      <YellowCard hasExtender={hasExtender} {...dataType as any} />
    );
  }

  if (type === 'red_card') {
    component = (
      <RedCard hasExtender={hasExtender} {...dataType as any} />
    );
  }

  if (type === 'substitution') {
    component = (
      <SubstitutionCard hasExtender={hasExtender} {...dataType as any} />
    );
  }

  if (type === 'penalty') {
    component = (
      <PenaltyGoalCard hasExtender={hasExtender} {...dataType as any} />
    );
  }

  if (type === 'penalty_missed') {
    component = (
      <PenaltyMissedCard hasExtender={hasExtender} {...dataType as any} />
    );
  }

  if (type === 'penalty_shootout') {
    component = (
      <PenaltyShootoutCard hasExtender={hasExtender} {...dataType as any} />
    );
  }

  if (type === 'owngoal') {
    component = (
      <OwnGoalCard hasExtender={hasExtender} {...dataType as any} />
    );
  }

  return component;
}
