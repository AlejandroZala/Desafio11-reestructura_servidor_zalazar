import userModel from "../models/users.js";

export default class UserManager {

    getUserBy = param => userModel.findOne(params).lean();
    createUser = user => userModel.create(user);
    updateUser = (id, user) => userModel.findOneAndUpdate(id, {$set:user})


    getUsers = async () => {
        return userModel.find().lean();
    };

    // getUsersBy = (params) => {
    //     return userModel.findOne(params).lean();
    // };

    // createUsers = (user) => {
    //     return userModel.create(user);
    // };

    // updateUsers = (id, user) => {
    //     return userModel.findByIdAndUpdate(id, user);
    // };

    updateOne = (parm, elem) => {
        return userModel.updateOne(parm, elem);
    };

    deleteUsers = (id) => {
        return userModel.findByIdAndDelete(id);
    };
};