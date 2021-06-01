import {root} from "@/api";
import axios from "axios";
import {SecurityService} from "@/security/SecurityService";
import {RegistrationOptions} from "@/models/RegistrationOptions";
import {UserCacheService} from "@/services/UserCacheService";

export class RegistrationService {
    private static base = `${root}/register`;

    public static async register(registrationOptions: RegistrationOptions): Promise<void> {

        return await axios.post(`${RegistrationService.base}/`, registrationOptions).then(value => {
            const data = value.data;
            if (data) {
                SecurityService.authUser(data);
                UserCacheService.addUser(data.user);
            } else {
                throw 'No data provided';
            }
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }
}