export interface BookSeed {
  isbn: string;
  title: string;
  publisher: string;
}

export const knownBooks: BookSeed[] = [
  { isbn: '9781449325862', title: 'Git Pocket Guide', publisher: "O'Reilly Media" },
  {
    isbn: '9781449331818',
    title: 'Learning JavaScript Design Patterns',
    publisher: "O'Reilly Media",
  },
  {
    isbn: '9781449337711',
    title: 'Designing Evolvable Web APIs with ASP.NET',
    publisher: "O'Reilly Media",
  },
  { isbn: '9781449365035', title: 'Speaking JavaScript', publisher: "O'Reilly Media" },
  { isbn: '9781491904244', title: "You Don't Know JS", publisher: "O'Reilly Media" },
  {
    isbn: '9781491950296',
    title: 'Programming JavaScript Applications',
    publisher: "O'Reilly Media",
  },
  {
    isbn: '9781593275846',
    title: 'Eloquent JavaScript, Second Edition',
    publisher: 'No Starch Press',
  },
  { isbn: '9781593277574', title: 'Understanding ECMAScript 6', publisher: 'No Starch Press' },
];

export const searchData = {
  existingTitle: 'Git Pocket Guide',
  existingKeyword: 'JavaScript',
  isbnQuery: '9781449325862',
  nonExistingTerm: 'thisbookdoesnotexist123',
  specialCharacters: '@#$%^&*',
  longQuery: 'q'.repeat(300),
};
