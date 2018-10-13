var mongodb = require('./db');
var markdown = require('markdown').markdown;

function PostArticle(name, picUrl, thum, thumTitle, title, content){
	this.name = name;
	this.title = title;
	this.content = content;
	this.picUrl = picUrl;
	this.thum = thum;
	this.thumTitle = thumTitle;
}

module.exports = PostArticle;

PostArticle.prototype.save = function(callback){
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
		title: this.title,
		content: this.content,
		comments:[],
		picUrl: this.picUrl,
		thum: this.thum,
		thumTitle: this.thumTitle,
		pv: 0,
		ranking: 0
	}

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('PostArticle', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(post, {
				safe:true
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


//获取所有name的文章
PostArticle.get = function(name, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('PostArticle', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			collection.find(query).sort({
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
//获取6篇文章
PostArticle.getSix = function(name, page, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('PostArticle', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			collection.count(query, function(err, total){
				collection.find(query, {
					skip: (page - 1)*5,
					limit:5
				}).sort({
					time: -1
				}).toArray(function(err, docs){
					mongodb.close();
					if(err){
						return callback(err);
					}
					callback(null, docs, total);
				})
			})
		})
	})
}


//获取当前的文章
PostArticle.getOne = function(id, callback){

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
				_id : id
			},function(err, doc){
				if(err){
					mongodb.close();
					return callback(err);
				}
				if(doc){
					collection.update({
						_id: id
					},{
						$inc: {"pv": 1},
						$set:{"ranking":doc.comments.length+doc.pv+1}
					},function(err){
						mongodb.close();
						if(err){
							return callback(err);
						}
					})
					doc.content = markdown.toHTML(doc.content);
					var allComments = doc.comments.reverse();
					var allComments = doc.comments;
					var fiveComments = [];
					for(var i=0;i<doc.comments.length;i++){
						if(i<5){
							fiveComments.push(allComments[i]);
						}
					}
					doc.fiveComments = fiveComments;
					//doc.comments.forEach(function(comment){
					//	comment.content = markdown.toHTML(comment.content);
					//})
					callback(null, doc);
				}
			})
			
		})
	})
}
//获取前五名文章  根据评论数加上浏览数总和
PostArticle.getTopFive = function(name, callback){

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('PostArticle', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
		
			collection.find(query, {
				limit:5
			}).sort({
				'ranking': -1
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
//编辑文章
PostArticle.edit = function(id, callback){
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
				'_id':id
			},function(err, doc){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, doc);
			})
		})
	})
}
PostArticle.update = function(id, thum, thumTitle, NewTitle, NewPicUrl, NewContent, callback){

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
				'_id':id
			},{
				$set: {
					title: NewTitle,
					picUrl:NewPicUrl,
					content: NewContent,
					thum: thum,
					thumTitle: thumTitle
				}
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
///删除文章
PostArticle.remove = function(id, callback){

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('PostArticle', function(err, collection){
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

///删除某文章的指定评论
PostArticle.removeComment = function(id, uuid, callback){
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
				'_id': id
			},{
				'$pull':{'comments':{'uuid':uuid}}
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