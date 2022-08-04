import {PersistentStorageService} from "@/services/PersistentStorageService";
import {TokenModel} from "@/models/TokenModel";
import {UserModel} from "@/models/UserModel";

export interface AuthModuleState {
    auth: TokenModel | null;
}

export const authModule = {
    state: {
        auth: PersistentStorageService.getItem('auth'),
    } as AuthModuleState,
    mutations: {
        authUser(state: AuthModuleState, tokenModel: TokenModel): void {
            state.auth = tokenModel;
            PersistentStorageService.setItem('auth', tokenModel);
            console.log(state);
        },
        clearToken(state: AuthModuleState): void {
            state.auth = null;
            PersistentStorageService.removeItem('auth');
        },
        resetState(state: AuthModuleState): void {
            state.auth = PersistentStorageService.getItem('auth');
        }
    },
    actions: {},
    modules: {},
    getters: {
        getTokenData(state: AuthModuleState): string | null {
            if (!state.auth)
                return null
            return state.auth.tokenData;
        },
        getUser(state: AuthModuleState): UserModel | null {
            if (!state.auth)
                return null
            return state.auth.user;
        },
    }
};
