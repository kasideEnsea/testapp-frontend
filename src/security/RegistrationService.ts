import {root} from "@/api";
import axios from "axios";
import {SecurityService} from "@/security/SecurityService";
import {RegistrationOptions} from "@/models/RegistrationOptions";
import {UserCacheService} from "@/services/UserCacheService";
import {ValidOptions} from "@/models/ValidOptions";

export class RegistrationService {
    private static base = `${root}/register`;

    public static async register(registrationOptions: RegistrationOptions): Promise<void> {
        return await axios.post(`${RegistrationService.base}/`, registrationOptions).then(value => { value.data;
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    public static async validate(validOptions: ValidOptions): Promise<void> {

        return await axios.post(`${RegistrationService.base}/valid/`, validOptions).then(value => {
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