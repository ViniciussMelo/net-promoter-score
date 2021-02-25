import { EntityRepository, getRepository, Repository } from "typeorm";
import { User } from "../models/User";

@EntityRepository(User)
class UsersRepository extends Repository<User> {

    async userAlreadyExists(email: string): Promise<boolean> {
        // SELECT * FROM USERS WHERE EMAIL = :email
        const user = await this.findOne({ email });

        return !!user;
    }
}

export { UsersRepository };