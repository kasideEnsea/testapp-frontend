<i18n src="./EventView.yaml"/>
<template>
    <div class="mx-auto fh" style="max-width: 1000px;">
        <h1>{{$t('title')}}</h1>
        <event-list :promiseProvider="feedPromise"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import {ResolvedEventService} from "@/services/ResolvedEventService";
    import EventList from "@/components/EventList/EventList.vue";
    import {TitleService} from "@/services/TitleService";
    import {ResolvedEventPage} from "@/models/ResolvedEventPage";

    @Component({
        components: {EventList}
    })
    export default class EventView extends Vue {
        feedPromise(page: number): Promise<ResolvedEventPage> {
            return ResolvedEventService.getEventFromFeed(page);
        }

        created() {
            this.setTitle();
        }

        @Watch("$i18n.locale")
        private setTitle() {
            TitleService.setTitle(this.$t('title').toString());
        }

    }
</script>

<style scoped>
    .fh {
        height: auto;
    }
</style>

<style>
    /*Fixes shade blinking bug*/
    /*noinspection CssUnusedSymbol*/
    .v-window__container--is-active {
        height: auto !important;
    }
</style>
