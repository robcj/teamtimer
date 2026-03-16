import { TimerConfig } from '@team-timer/core';

const demoConfig: TimerConfig = {
  countdownToStart: 10,
  gameHalfDuration: 10,
  halfTimeDuration: 10,
  betweenGamesDuration: 10,
  extraTimeHalfDuration: 10,
  keepScreenAwake: true,
  locations: [
    {
      id: 'loc-court-1-windows-side-ontz80',
      name: 'Court 1 (Windows side)',
    },
    {
      id: 'loc-court-2-stands-side-e2b5zu',
      name: 'Court 2 (Stands side)',
    },
  ],
  divisions: [
    {
      id: 'div-women-a-aax3uw',
      name: 'Women A',
    },
    {
      id: 'div-women-b-bos442',
      name: 'Women B',
    },
    {
      id: 'div-open-a-u4ocwu',
      name: 'Open A',
    },
    {
      id: 'div-open-b-reekel',
      name: 'Open B',
    },
  ],
  teams: [
    {
      id: 'team-plankton-u2ggvs',
      name: 'Plankton',
      divisionId: 'div-open-b-reekel',
    },
    {
      id: 'team-tadpoles-85rpr3',
      name: 'Tadpoles',
      divisionId: 'div-open-b-reekel',
    },
    {
      id: 'team-minnows-3nm143',
      name: 'Minnows',
      divisionId: 'div-open-b-reekel',
    },
    {
      id: 'team-portside-37zp4s',
      name: 'Portside',
      divisionId: 'div-open-a-u4ocwu',
    },
    {
      id: 'team-crox-ccvflt',
      name: 'Crox',
      divisionId: 'div-open-a-u4ocwu',
    },
    {
      id: 'team-barracudas-w7y1ui',
      name: 'Barracudas',
      divisionId: 'div-open-a-u4ocwu',
    },
    {
      id: 'team-portside-women-y6l6b3',
      name: 'Portside Women',
      divisionId: 'div-women-a-aax3uw',
    },
    {
      id: 'team-phoenix-women-xo35xm',
      name: 'Phoenix Women',
      divisionId: 'div-women-a-aax3uw',
    },
    {
      id: 'team-auckland-women-8ovba1',
      name: 'Auckland Women',
      divisionId: 'div-women-a-aax3uw',
    },
    {
      id: 'team-portside-women-b-mfq5ez',
      name: 'Portside Women B',
      divisionId: 'div-women-b-bos442',
    },
    {
      id: 'team-krill-i6894q',
      name: 'Krill',
      divisionId: 'div-women-b-bos442',
    },
    {
      id: 'team-copepods-kiqaaa',
      name: 'Copepods',
      divisionId: 'div-women-b-bos442',
    },
  ],
  games: [
    {
      team1: 'team-barracudas-w7y1ui',
      team2: 'team-crox-ccvflt',
      locationId: 'loc-court-1-windows-side-ontz80',
    },
    {
      team1: 'team-minnows-3nm143',
      team2: 'team-plankton-u2ggvs',
      locationId: 'loc-court-1-windows-side-ontz80',
    },
    {
      team1: 'team-auckland-women-8ovba1',
      team2: 'team-phoenix-women-xo35xm',
      locationId: 'loc-court-2-stands-side-e2b5zu',
    },
    {
      team1: 'team-copepods-kiqaaa',
      team2: 'team-krill-i6894q',
      locationId: 'loc-court-2-stands-side-e2b5zu',
    },
    {
      team1: 'team-barracudas-w7y1ui',
      team2: 'team-portside-37zp4s',
      locationId: 'loc-court-1-windows-side-ontz80',
    },
    {
      team1: 'team-auckland-women-8ovba1',
      team2: 'team-portside-women-y6l6b3',
      locationId: 'loc-court-2-stands-side-e2b5zu',
    },
  ],
  leftTeamLabel: 'White (Shallow)',
  rightTeamLabel: 'Black (Deep)',
  tournamentStartAt: '2026-03-04T10:00',
  competitionName: 'Demo with 10sec games',
};

export default demoConfig;
