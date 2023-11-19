type Character = {
  id: string;
  uncapitalized: string;
  capitalized: string;
};

const characters: Character[] = [
  {
    id: '1',
    uncapitalized: 'ƀ',
    capitalized: 'Ƀ',
  },
  {
    id: '2',
    uncapitalized: 'č',
    capitalized: 'Č',
  },
  {
    id: '3',
    uncapitalized: 'ě',
    capitalized: 'Ě',
  },
  {
    id: '4',
    uncapitalized: 'ê̌',
    capitalized: 'Ê̌',
  },
  {
    id: '5',
    uncapitalized: 'ǐ',
    capitalized: 'Ǐ',
  },
  {
    id: '6',
    uncapitalized: 'ñ',
    capitalized: 'Ñ',
  },
  {
    id: '7',
    uncapitalized: 'ň',
    capitalized: 'Ň',
  },
  {
    id: '8',
    uncapitalized: 'ǒ',
    capitalized: 'Ǒ',
  },
  {
    id: '9',
    uncapitalized: 'ơ̆',
    capitalized: 'Ơ̆',
  },
  {
    id: '10',
    uncapitalized: 'ô̆',
    capitalized: 'Ô̆',
  },
  {
    id: '11',
    uncapitalized: 'ǔ',
    capitalized: 'Ǔ',
  },
  {
    id: '12',
    uncapitalized: 'ư̆',
    capitalized: 'Ư̆',
  },
];

export default characters;
