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

    getSingleUserByQuery( query: any ): Promise<any> {
		return new Promise(async (resolve, reject) => {
            try {
                const user = await this.user.findOne(query);
                resolve(user);
            } catch (error) {
                console.error('error In ====>>>> getSingleUserByQuery <<<<====', error);
                return reject({ status: 0, error });
            }
        });
	}
}
export default new UserService();