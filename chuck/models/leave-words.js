var mongodb = require('./db');
var async = require('async');

function LeaveWords(user, message){
	this.name = user;
	this.message = message;
}
module.exports = LeaveWords;


LeaveWords.prototype.save = function(callback){

	var date = new Date();
	var name = this.name;
	var message = this.message;
	var id=0;
	var time = {
		data: date,
		year: date.getFullYear(),
		month: date.getFullYear() + "-" + (date.getMonth()+1),
		day: date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
		minute: date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	}
	async.waterfall([
	    function(call){
		    mongodb.open(function(err, db){
				if(err){
					return callback(err);
				}

				db.collection('leaveWords', function(err, collection){
					if(err){
						return callback(err);
					}

					var query = {};//查找数据库总条数
					collection.find(query).toArray(function(err, docs){
						mongodb.close();
						if(err){
							return callback(err);
						}
						id = docs.length+1;
						call(null, id)
					})
				})
			})
	    },  
	    function(id, call){
		     var user = {
				name: name,
				message: message,
				time: time,
				id: id
			}
			call(null, user)
	    }
	], function(err, user){
		mongodb.open(function(err, db){
			if(err){
				return callback(err);
			}

			db.collection('leaveWords', function(err, collection){
				if(err){
					return callback(err);
				}

				collection.insert(user, {
					safe: true
				},function(err, user){
					mongodb.close();
					if(err){
						return callback(err);
					}
					callback(null, user[0])
				})
			})
		})
	});	
}
LeaveWords.readAll = function(name, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('leaveWords', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			collection.find(query,{
				limit: 10
			}).sort({
				time: -1
			}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, docs);
			})
		})
	})
}
LeaveWords.readTen = function(name, page, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('leaveWords', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			//collection.count(query, function(err, total){
				collection.find(query, {
					skip: (page -1)*10,
					limit: 10
				}).sort({
					time: -1
				}).toArray(function(err, docs){
					mongodb.close();
					if(err){
						return callback(err);
					}
					callback(null, docs);
				})
			//})
		})
	})
}
