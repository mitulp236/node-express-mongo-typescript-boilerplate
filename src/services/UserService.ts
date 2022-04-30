import UserModel from "../model/User/user.model";

class UserService {

    private user = UserModel;

    getUserByEmailId = async ( email: string ) => {
        const user = await this.user.findOne( { email });
        return user;
    }

    getUserById = async ( id: string ) => {
        const user = await this.user.findById(id);
        return user;
    }
}
export default new UserService();