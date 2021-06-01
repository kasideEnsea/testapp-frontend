import {UserModel} from "@/models/UserModel";
import store from "@/store"

export class UserCacheService {
    public static get getAllUsers(): UserModel[] {
        return store.getters.getAllCachedUsers;
    }

    public static getUsers(ids: number[]): UserModel[] {
        const getter = store.getters.getCachedUsers;
        return getter(ids);
    }

    public static getUser(id: number): UserModel | undefined {
        const getter = store.getters.getCachedUser;
        return getter(id);
    }

    public static addUser(user: UserModel): void {
        store.commit('cacheUsers', [user]);
    }

    public static addUsers(users: UserModel[]): void {
        store.commit('cacheUsers', users);
    }

}
