import {UserModel} from "@/models/UserModel";

export interface UsersModuleState {
    users: Record<number, UserModel>;
}

export const usersModule = {
    state: {
        users: {}
    } as UsersModuleState,
    mutations: {
        cacheUser(state: UsersModuleState, user: UserModel): void {
            state.users[user.id] = user;
        },

        cacheUsers(state: UsersModuleState, users: UserModel[]): void {
            for (const user of users) {
                state.users[user.id] = user;
            }
        }
    },
    actions: {},
    modules: {},
    getters: {
        getAllCachedUsers(state: UsersModuleState): UserModel[] {
            return Object.values(state.users);
        },

        getCachedUsers(state: UsersModuleState) {
            return (ids: number[]) => {
                const users: UserModel[] = [];
                for (const id of ids)
                    if (state.users[id])
                        users.push(state.users[id]);
                return users;
            }
        },

        getCachedUser(state: UsersModuleState) {
            return (id: number) => {
                return state.users[id]
            }
        }
    }
};
