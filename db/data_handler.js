var db = require('./config.js')
var Users = require('./schema/User.js')
var ActiveUsers = require('./schema/ActiveUsers.js');
var sequelize = require('sequelize')
var util = require('./util.js')


module.exports.createUser = (nI, cb) => {
  db.query('select id from Users where email = ?',
  {replacements : [nI.email], type : sequelize.QueryTypes.SELECT})
  .then(userFound => {
    if (userFound.length > 0) {
      cb('Email already registered, try logging in');
    } else {
      util.cipher(nI.password)
      .then(hashedPassword => {
        Users.create({email : nI.email, firstname : nI.firstname, lastname : nI.lastname, password : hashedPassword})
        .then(newUser => {
          cb(false, newUser.dataValues);
        })
        .catch(error => {
          cb(error);
        })
      })
      .catch(error => {
        cb(error);
      })
    }
  })
  .catch(error => {
    cb(error);
  })
}

module.exports.userLogin = (email, password, cb) => {
  db.query('select * from Users where email = ?', 
  {replacements : [email], type : sequelize.QueryTypes.SELECT})
  .then(userFound => {
    if (userFound.length === 1) {
      util.comparePassword(password, userFound[0].password)
      .then(match => {
        if (match) {
          cb(false, {id : userFound[0].id});
        } else {
          cb('Password/Email combination did not match');
        }
      })
      .catch(error => {
        cb(error);
      })
    } else {
      cb('User not found');
    }
  })
  .catch(error => {
    cb(error);
  })
}

module.exports.userLogout = (inputId, cb) => {
  db.query('delete from ActiveUsers where userId = ?',
  {replacements : [inputId], type : sequelize.QueryTypes.DELETE})
  .then(result => {
    cb(false);
  })
  .catch(error => {
    console.log('in error', error);
    cb(error);
  })
}

module.exports.exitRoom = (inputId, cb) => {
  console.log(inputId)
  db.query('update ActiveUsers set roomId = 0 where userId = ?', 
  {replacements : [inputId], type : sequelize.QueryTypes.UPDATE})
  .then(result => {
    cb(false);
  })
  .catch(error => {
    cb(error);
  })
}

module.exports.findGlobalRoom = (inputId, cb) => {
    db.query('select roomId from ActiveUsers where roomId != 0 group by roomId having count(roomId) < 10', 
    {type : sequelize.QueryTypes.SELECT})
    .then(res1 => {
      if (res1.length === 0) {
        db.query('select max(roomId) from ActiveUsers',
        {type : sequelize.QueryTypes.SELECT})
        .then(res2 => {
          db.query('update ActiveUsers set roomId = ? where userId = ?',
          {replacements : [res2[0]['max(roomId)']+1, inputId], type : sequelize.QueryTypes.UPDATE})
          .then(res3 => {
            cb(false, res2[0]['max(roomId)']+1, true);
          })
          .catch(error => {
            cb(error);
          })
        })
        .catch(error => {
          cb(error);
        })
      } else {
        db.query('update ActiveUsers set roomId = ? where userId = ?',
        {replacements : [ res1[0].roomId, inputId], type : sequelize.QueryTypes.UPDATE})
        .then(res4 => {
          cb(false, res1[0].roomId, false)
        })
        .catch(error => {
          cb(error);
        })
      }
     })
    .catch(err => {
      console.log('error', err);
    })
}

module.exports.findLocalRoom = (user, lat, long, cb) => {
  db.query('select roomId from ActiveUsers where roomId != 0 group by roomId having count(roomId) < 10',
   {type : sequelize.QueryTypes.SELECT})
   .then(res1 => {
     if (res1.length === 0) {
        db.query('select max(roomId) from ActiveUsers',
        {type : sequelize.QueryTypes.SELECT})
        .then(res2 => {
          db.query('update ActiveUsers set roomId = ? where userId = ?',
          {replacements : [res2[0]['max(roomId)']+1, user], type : sequelize.QueryTypes.UPDATE})
          .then(res3 => {
            cb(false, res2[0]['max(roomId)']+1, true);
          })
          .catch(error => {
            cb(error);
          })
        })
        .catch(error => {
          cb(error);
        })
     } else {
       var roomsIds = [];
       res1.forEach(id => {roomsIds.push(id['roomId'])});
       db.query('select latitude, longitude, roomId from ActiveUsers where roomId in (?)',
        {replacements : [roomsIds], type : sequelize.QueryTypes.SELECT})
        .then(res4 => {
          for(var i = 0; i <res4.length; i++){
            var temp = distance(lat, long, res4[i]['latitude'], res4[i]['longitude']);
            if(temp < currDistance) {
              currDistance = temp;
              shortestPoint = res4[i]['roomId'];
            }
          }
          db.query('update ActiveUsers set roomId = ? where userId = ?',
          {replacements : [shortestPoint, user], type : sequelize.QueryTypes.UPDATE})
          .then(res5 => {
            cb(false, shortestPoint, false, currDistance);
          })
          .catch(error => {
            cb(error);
          })
        })
        .catch(error => {
          cb(error);
        })
     }
   })
   .catch(error => {
     cb(error);
   })
}