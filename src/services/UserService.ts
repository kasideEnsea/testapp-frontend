import axios, {AxiosPromise} from 'axios';
import {UserModel} from "@/models/UserModel";
import {root} from "@/api";
import {UserCacheService} from "@/services/UserCacheService";

export class UserService {
    private static base = `${root}/user`;

    public static async getUserById(id: number): Promise<UserModel> {
        const user = UserCacheService.getUser(id);
        if (user != null)
            return user;
        const promise = axios.get(`${this.base}/id/${id}`);
        return this.cacheAxiosPromiseAndReturn(promise);
    }

    public static getUserByLogin(login: string): Promise<UserModel> {
        login = encodeURIComponent(login);
        const promise = axios.get(`${this.base}/login/${login}`);
        return this.cacheAxiosPromiseAndReturn(promise);
    }

    public static async getUsersByIds(ids: number[]): Promise<UserModel[]> {
        ids = [...new Set(ids)];
        const users: UserModel[] = UserCacheService.getUsers(ids);
        const cachedIds = users.map(u => u.id);
        const undef = ids.filter(v => !cachedIds.includes(v));
        try {
            await this.loadUsersToCache(undef);
            return UserCacheService.getUsers(ids);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    private static async cacheAxiosPromiseAndReturn(promise: AxiosPromise<UserModel>): Promise<UserModel> {
        return await promise.then(value => {
            const data = value.data;
            UserCacheService.addUser(data);
            return data;
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    private static async loadUsersToCache(undef: number[]): Promise<void> {
        if (undef.length > 0) {
            await axios.post<UserModel[]>(`${this.base}/ids/`, undef).then(value => {
                UserCacheService.addUsers(value.data);
            }).catch(reason => {
                return Promise.reject(reason);
            });
        }
    }

    public static async getUsersFromAxiosPromise(ids: AxiosPromise<number[]>): Promise<UserModel[]> {
        return await ids.then(value => {
            return this.getUsersByIds(value.data);
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }
}
