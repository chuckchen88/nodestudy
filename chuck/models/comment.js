var mongodb = require('./db');




function Comment(id, comment){
	this.id = id;
	this.comment = comment;
}

module.exports = Comment;

Comment.prototype.save = function(callback){
	var id = this.id,
		comment = this.comment;

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('PostArticle', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.update({
				'_id' : id
			},{
				$push:{"comments": comment}
			}, function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			})
		})
	})
}

Comment.readFive=function(id, n, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('PostArticle', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				'_id': id
			}, function(err, article){
				mongodb.close();
				if(err){
					return callback(err);
				}
				var allComments = article.comments.reverse();
				var fiveComments = [];
				for(var i=0;i<article.comments.length;i++){
					if(i>=((n-1)*5)&&i<(n*5)){
						fiveComments.push(allComments[i]);
					}
				}
				callback(null, fiveComments);
			})
		})
	})
}

////更换评论区用户头像
/*Comment.updateHeadImg = function(name, userName, headNum, callback){
	console.log('hi');
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('PostArticle', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.update({
				'name' : name
			},{
				'$set':{'comments.$.headImgNum': headNum}   ///////这里错误
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}

				callback(null);
			})
		})
	})
}*/