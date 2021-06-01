import {ResolvedEventModel} from "@/models/ResolvedEventModel";

export interface ResolvedEventPage {
    page: number;
    totalPages: number;
    data: ResolvedEventModel[];
}
