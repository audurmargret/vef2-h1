export const seriesSanitazions = [
    check('showName').trim().escape(),
    check('releaseDate').trim().escape(),
    check('stillGoing').trim().escape(),
    check('tagline').trim().escape(),
    check('photo').trim().escape(),
    check('about').trim().escape(),
    check('language').trim().escape(),
    check('channel').trim().escape(),
    check('url').trim().escape()
  ];
  
  export const genreSanitazions = [
    check('typename').trim().escape()
  ];

  export const rateSanitazions = [
    check('seriesId').trim().escape(),
    check('userId').trim().escape(),
    check('status').trim().escape(),
    check('rating').trim().escape()
  ];
  
  
  export const stateSanitazions = [
    check('tvgenreId').trim().escape(),
    check('status')
  ];
  
  export const userSanitazions = [
    check('username').trim().escape(),
    check('email').trim().escape(),
    check('password').trim().escape()
  ];
  
  export const seasonSanitazions = [
    check('showName').trim().escape(),
    check('seasonNum').trim().escape(),
    check('releaseDate').trim().escape(),
    check('about').trim().escape(),
    check('photo').trim().escape(),
    check('seriesId').trim().escape()
  ];
  
  export const episodeSanitazions = [
    check('episodeName').trim().escape(),
    check('epiNum').trim().escape(),
    check('releaseDate').trim().escape(),
    check('about').trim().escape(),
    check('season').trim().escape(),
    check('seriesId').trim().escape()  
  ];
  
