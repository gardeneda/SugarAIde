const path = require('path');

exports.createHTML = (req, res) => {
  res.render(path.join(__dirname, '..', 'views', 'dietTrack'), { title: 'Diet Tracker' });
};
