var mongodb = require('./db');

function PostAna(name, picUrl, content){
	this.name = name;
	this.picUrl = picUrl;
	this.content = content;
}

module.exports = PostAna;

PostAna.prototype.save = function(callback){
	var date = new Date();

	var time = {
		data: date,
		year: date.getFullYear(),
		month: date.getFullYear() + "-" + (date.getMonth()+1),
		day: date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
		minute: date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	}

	var post = {
		name: this.name,
		time: time,
		content: this.content,
		picUrl: this.picUrl
	}

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('PostAna',function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(post,{
				safe:true
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			})
		})
	})
}

PostAna.readTen = function(name, page, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('PostAna',function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			collection.find(query,{
				skip: (page - 1)*10,
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

PostAna.remove = function(id, callback){

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('PostAna',function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.remove({
				'_id':id
			},{
				w : 1
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			})
		})
	})
}