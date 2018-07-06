var express = require('express');
var router = express.Router();

var db = require('./db/pg.js');

class RowDataPacket {
  constructor(specialtyid, specialty) {
    this.specialtyid = specialtyid;
    this.specialty = specialty;
  }
}

function renderIndex(res, template, newTitle, newspecialty, newresults) {
  return res.render(template, { title: newTitle, rating: [{val: ' '},{val: 1},{val: 2},{val: 3},{val: 4},{val: 5}], specialty: newspecialty, results: newresults });
}

function renderProfile(res, template, newTitle, newspecialty, newresults, newSimilar) {
  return res.render(template, { title: newTitle, rating: [{val: ' '},{val: 1},{val: 2},{val: 3},{val: 4},{val: 5}], specialty: newspecialty, results: newresults, similar: newSimilar });
}

function undefinedOrBlank(str) {
  if (str === undefined || str === '' || str === ' ' || str === NaN) {
    return true;
  }
  return false;
}

router.get('/doctor/:path1', function(req, res, next) {
  db.any('SELECT * FROM specialty', []).then(function (rows) {
    db.any('SELECT * FROM doctor a, specialty b WHERE a.doctorid = $1 AND a.specialty = b.specialtyid', [req.params.path1]).then(function (rows2) {
      db.any('SELECT * FROM doctor a, specialty b WHERE a.specialty = b.specialtyid AND b.specialty = $1 AND NOT a.doctorid = $2 LIMIT 3', [rows2[0].specialty, rows2[0].doctorid]).then(function (rows3) {
        renderProfile(res, 'doctorprofile', 'Similar Doctors' , rows, rows2, rows3);
      })
      .catch(function(error) {
        console.log(error);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
  })
  .catch(function(error) {
    console.log(error);
  });
});

router.get('/', function(req, res, next) {
  db.any('SELECT * FROM specialty', []).then(function (rows) {
    if (!undefinedOrBlank(req.query.search) && !undefinedOrBlank(req.query.rating) && !undefinedOrBlank(req.query.specialty)) {
      console.log('0');
      db.any('SELECT * FROM doctor a, specialty b WHERE (a.firstname ILIKE $1 OR a.lastname ILIKE $2) AND a.Vote >= $3 AND a.specialty = b.specialtyid AND b.specialty = $4', ['%'+req.query.search+'%', '%'+req.query.search+'%', req.query.rating, req.query.specialty]).then(function (rows2) {
        renderIndex(res, 'index', 'Similar Doctors', rows, rows2);
      })
      .catch(function(error) {
        console.log(error);
      });
    } else if (!undefinedOrBlank(req.query.search) && !undefinedOrBlank(req.query.rating) && undefinedOrBlank(req.query.specialty)) {
      console.log('1');
      db.any('SELECT * FROM doctor a, specialty b WHERE (a.firstname ILIKE $1 OR a.lastname ILIKE $2) AND a.Vote >= $3 AND a.specialty = b.specialtyid', ['%'+req.query.search+'%', '%'+req.query.search+'%', req.query.rating]).then(function (rows2) {
        renderIndex(res, 'index', 'Similar Doctors', rows, rows2);
      })
      .catch(function(error) {
        console.log(error);
      });
    } else if (!undefinedOrBlank(req.query.search) && undefinedOrBlank(req.query.rating) && undefinedOrBlank(req.query.specialty)) {
      console.log('2');
      db.any('SELECT * FROM doctor a, specialty b WHERE (a.firstname ILIKE $1 OR a.lastname ILIKE $2) AND a.specialty = b.specialtyid', ['%'+req.query.search+'%', '%'+req.query.search+'%']).then(function (rows2) {
        renderIndex(res, 'index', 'Similar Doctors', rows, rows2);
      })
      .catch(function(error) {
        console.log(error);
      });
    } else if (undefinedOrBlank(req.query.search) && !undefinedOrBlank(req.query.rating) && undefinedOrBlank(req.query.specialty)) {
      console.log('3');
      db.any('SELECT * FROM doctor a, specialty b WHERE a.Vote >= $1 AND a.specialty = b.specialtyid', [req.query.rating]).then(function (rows2) {
        renderIndex(res, 'index', 'Similar Doctors', rows, rows2);
      })
      .catch(function(error) {
        console.log(error);
      });
    } else if (!undefinedOrBlank(req.query.search) && !undefinedOrBlank(req.query.rating) && undefinedOrBlank(req.query.specialty)) {
      console.log('4');
      db.any('SELECT * FROM doctor a, specialty b WHERE (a.firstname ILIKE $1 OR a.lastname ILIKE $2) AND a.Vote >= $3 AND a.specialty = b.specialtyid', ['%'+req.query.search+'%', '%'+req.query.search+'%', req.query.rating]).then(function (rows2) {
        renderIndex(res, 'index', 'Similar Doctors', rows, rows2);
      })
      .catch(function(error) {
        console.log(error);
      });  
    } else if (undefinedOrBlank(req.query.search) && !undefinedOrBlank(req.query.rating) && !undefinedOrBlank(req.query.specialty)) {
      console.log('5');
      db.any('SELECT * FROM doctor a, specialty b WHERE a.Vote >= $1 AND a.specialty = b.specialtyid AND b.specialty = $2', [req.query.rating, req.query.specialty]).then(function (rows2) {
        renderIndex(res, 'index', 'Similar Doctors', rows, rows2);
      })
      .catch(function(error) {
        console.log(error);
      });
    } else if (undefinedOrBlank(req.query.search) && undefinedOrBlank(req.query.rating) && !undefinedOrBlank(req.query.specialty)) {
      console.log('6');
      db.any('SELECT * FROM doctor a, specialty b WHERE a.specialty = b.specialtyid AND b.specialty = $1', [req.query.specialty]).then(function (rows2) {
        renderIndex(res, 'index', 'Similar Doctors', rows, rows2);
      })
      .catch(function(error) {
       console.log(error);
      });
    } else if (!undefinedOrBlank(req.query.search) && undefinedOrBlank(req.query.rating) && !undefinedOrBlank(req.query.specialty)) {
      console.log('7');
      db.any('SELECT * FROM doctor a, specialty b WHERE (a.firstname ILIKE $1 OR a.lastname ILIKE $2) AND a.specialty = b.specialtyid AND b.specialty = $3', ['%'+req.query.search+'%', '%'+req.query.search+'%', req.query.specialty]).then(function (rows2) {
        renderIndex(res, 'index', 'Similar Doctors', rows, rows2);
      })
      .catch(function(error) {
         console.log(error);
      });    
    } else if (undefinedOrBlank(req.query.search) && undefinedOrBlank(req.query.rating) && undefinedOrBlank(req.query.specialty)) {
      console.log('8');
      db.any('SELECT * FROM doctor a, specialty b WHERE a.specialty = b.specialtyid ORDER BY a.doctorid', []).then(function (rows2) {
        renderIndex(res, 'index', 'Similar Doctors', rows, rows2);
      })
      .catch(function(error) {
         console.log(error);
      });
    } else {
      console.log('else');
      renderIndex(res, 'index', 'Similar Doctors', rows, rows2);
    }
  })
  .catch(function(error) {
     console.log(error);
  });
});

module.exports = router;
