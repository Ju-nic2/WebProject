const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
    img1:{
        type: Sequelize.STRING(200),// 경로 지정 
        allowNull: false,
    },
    img2:{
        type: Sequelize.STRING(200),// 경로 지정 
        allowNull: true,
    },
    img3:{
        type: Sequelize.STRING(200),// 경로 지정 
        allowNull: true,
    },
    img4:{
        type: Sequelize.STRING(200),// 경로 지정 
        allowNull: true,
    },
    img5:{
        type: Sequelize.STRING(200),// 경로 지정 
        allowNull: true,
    },
    content: {
        type: Sequelize.STRING(140),
        allowNull: false,
    },
    createdAt: {//작성일
        type: Date,
        default: Date.now,
    },
     
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
  }
};
