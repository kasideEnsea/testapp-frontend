import {AxiosPromise} from 'axios';
import {EventModel} from "@/models/EventModel";
import {UserService} from "@/services/UserService";
import {ResolvedEventModel} from "@/models/ResolvedEventModel";
import {EventService} from "@/services/EventService";
import {ResolvedEventPage} from "@/models/ResolvedEventPage";
import {EventPage} from "@/models/EventPage";

export class ResolvedEventService {
    public static getEventFromFeed(page: number): Promise<ResolvedEventPage> {
        return this.resolveUsersFromAxiosPromisePage(EventService.getEventFromFeed(page));
    }

    public static async resolveUserFromAxiosPromise(promise: AxiosPromise<EventModel>): Promise<ResolvedEventModel> {
        return this.resolveAsync((await promise).data);
    }

    public static async resolveUsersFromAxiosPromise(promise: AxiosPromise<EventModel[]>): Promise<ResolvedEventModel[]> {
        return this.resolveListAsync((await promise).data);
    }

    public static async resolveUsersFromAxiosPromisePage(promise: AxiosPromise<EventPage>): Promise<ResolvedEventPage> {
        const page = (await promise).data;
        const data = await this.resolveListAsync(page.data);
        return new class implements ResolvedEventPage {
            page = page.page;
            totalPages = page.totalPages;
            data = data;
        };
    }

    public static async resolveAsync(event: EventModel): Promise<ResolvedEventModel> {
        await UserService.getUserById(event.userId);
        return this.resolveEvent(event);
    }

    public static async resolveListAsync(eventList: EventModel[]): Promise<ResolvedEventModel[]> {
        const users = eventList.map(event => event.userId);
        await UserService.getUsersByIds(users);
        return Promise.all(eventList.map(this.resolveEvent));
    }

    public static async resolveEvent(event: EventModel): Promise<ResolvedEventModel> {
        return {
            ...event,
            user: await UserService.getUserById(event.userId),
        };
    }

    private static getEventById(id: number): Promise<ResolvedEventModel> {
        return this.resolveUserFromAxiosPromise(EventService.getEventById(id));
    }
}
