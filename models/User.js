const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'junic',
      },
      isCheckedEmail: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue : true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  //sequelize 가 자동으로 addFollow, getFolloers, getFollowings 함수 생성해줌. 
  static associate(db) {
    db.User.belongsToMany(db.User, { //내가 팔로우 하는 사람들 
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, { // 나를 팔로우 하는 사람들 
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    });
  }
};
