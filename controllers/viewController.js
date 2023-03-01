exports.getOverview = (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Milos',
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
  });
};
