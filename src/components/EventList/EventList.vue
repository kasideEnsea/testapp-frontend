<i18n src="./EventList.yaml"/>
<template>
    <div style="max-width: 800px">
        <template v-if="data">
            <event-card :event="event" :key="event.id" v-for="event in data"/>
        </template>
        <p v-if="isSuccess && !data.length">
            {{$t('nothing_found')}}
        </p>
        <v-alert type="info" v-if="isLoading">
            {{$t('loading')}}
        </v-alert>
        <v-alert type="error" v-if="isError">
            {{$t('error')}}
        </v-alert>
        <div class="text-center my-4" v-if="showUpdatePage">
            <v-btn @click="reloadAndShowMore" class="mx-auto text--white" color="primary">{{$t('update_and_show_more')}}
            </v-btn>
        </div>
        <div class="text-center my-4" v-if="!showUpdatePage && toLoad < totalPages">
            <v-btn @click="loadMore" class="mx-auto text--white" color="primary">{{$t('show_more')}}</v-btn>
        </div>
        <v-pagination
                :length="totalPages"
                v-model="page"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import {State} from "@/enum/State";
    import {ResolvedEventModel} from "@/models/ResolvedEventModel";
    import {ResolvedEventPage} from "@/models/ResolvedEventPage";
    import EventCard from "@/components/EventCard/EventCard.vue";

    @Component({
        components: {EventCard}
    })
    export default class EventList extends Vue {
        state: State = State.None;
        data: ResolvedEventModel[] | null = null;
        page = 1;
        toLoad = 1;
        totalPages = 0;
        @Prop() promiseProvider!: (page: number) => Promise<ResolvedEventPage>;
        @Prop() showUpdatePage?: boolean;

        get isLoading(): boolean {
            return this.state == State.Loading;
        }

        get isSuccess(): boolean {
            return this.state == State.Success;
        }

        get isError(): boolean {
            return this.state == State.Error;
        }

        created(): void {
            this.load();
        }

        @Watch("page")
        private pageChanged(): void {
            this.data = null;
            this.toLoad = this.page;
            this.load()
        }

        private reloadAndShowMore(): void {
            this.load();
            this.loadMore()
        }

        private loadMore(): void {
            this.toLoad++;
            this.load();
        }

        private load(): void {
            this.state = State.Loading;
            this.promiseProvider(this.toLoad - 1).then(value => {
                if (this.data) {
                    const data = this.data;
                    const newData = value.data.filter(el => data.findIndex(v => v.id === el.id) < 0);
                    this.data = data.concat(newData);
                } else {
                    this.data = value.data;
                }
                this.totalPages = value.totalPages;
                this.state = State.Success;
            }).catch(reason => {
                console.error("Reason: " + reason);
                this.state = State.Error;
            });
        }
    }
</script>

<style scoped>
</style>
