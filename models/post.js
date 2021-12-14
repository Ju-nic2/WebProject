const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      img1:{
          type: Sequelize.STRING(200),// 경로 지정 
          allowNull: true,
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
      writername: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'junic',
      },
      content: {
          type: Sequelize.STRING(140),
          allowNull: false,
      },
    
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8',
    });
  }

  static associate(db) {
   db.Post.belongsTo(db.User,{foreignKey: 'writerid', targetKey: 'uid'}); //유저와 외래키 연결
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
  }
};