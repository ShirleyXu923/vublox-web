/* eslint-disable import/prefer-default-export */
import { startCase } from 'lodash';

const types = {
  midfielder: 'MD',
  forward: 'FW',
  goalkeeper: 'GK',
  defender: 'DF',
  attacker: 'AT',
};

export const getPlayerType = (playerType: string, isSmScreen: boolean) => {
  if (!playerType) return '';

  if (isSmScreen) {
    return (types as any)[playerType];
  }

  return startCase(playerType);
};
