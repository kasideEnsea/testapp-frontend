<i18n src="./EventCard.yaml"/>
<template>
    <v-card class="event" v-if="visible">
        <router-link :to="`/profile/${event.userId}`">
            {{event.user.name}}
        </router-link>
        <span v-if="event.type==='registered'">
            {{$t('registered')}}
        </span>
        <span v-else-if="event.type==='created'">
            {{tt('created')}}
            <router-link :to="`/tasks/${event.userId}`" class="task-name">{{event.taskName}}</router-link>
        </span>
        <span v-else-if="event.type==='modified'">
            {{tt('modified-from')}}
            <router-link :to="`/tasks/${event.userId}`" class="task-name">{{event.taskName}}</router-link>
            {{tt('modified-to')}}
            <router-link :to="`/tasks/${event.userId}`" class="task-name">{{event.newValue}}</router-link>
        </span>
        <span v-else-if="event.type==='modified-deadline'">
            {{tt('modified-deadline-of')}}
            <router-link :to="`/tasks/${event.userId}`" class="task-name">{{event.taskName}}</router-link>
            {{tt('modified-deadline-to')}}
            <datetime :time-str="new Date(event.newValue)"/>
        </span>
        <span v-else-if="event.type==='deleted'">
            {{tt('deleted')}}
            <router-link :to="`/tasks/${event.userId}`" class="task-name">{{event.taskName}}</router-link>
        </span>
        <span v-else-if="event.type==='done'">
            {{tt('done-1')}}
            <router-link :to="`/tasks/${event.userId}`" class="task-name">{{event.taskName}}</router-link>
            {{tt('done-2')}}
        </span>
        <span v-else-if="event.type==='undone'">
            {{tt('undone-1')}}
            <router-link :to="`/tasks/${event.userId}`" class="task-name">{{event.taskName}}</router-link>
            {{tt('undone-2')}}
        </span>
        <v-card class="comment" v-if="event.comment">
            {{event.comment}}
        </v-card>
        <div class="actionBar">
            <a @click="deleteEvent" class="float-right" v-if="isModeratorOrAdmin">{{$t('delete')}}</a>
        </div>
    </v-card>
</template>

<script lang="ts">
    import {Component, Prop} from "vue-property-decorator";
    import LanguageSelector from "@/components/Header/LanguageSelector.vue";
    import Datetime from "@/components/Datetime.vue";
    import DateEditor from "@/components/DateEditor/DateEditor.vue";
    import {ResolvedEventModel} from "@/models/ResolvedEventModel";
    import SecurityMixin from "@/security/SecurityMixin";
    import {EventService} from "@/services/EventService";

    @Component({
        components: {DateEditor, Datetime, LanguageSelector}
    })
    export default class TaskCard extends SecurityMixin {
        @Prop() event!: ResolvedEventModel;
        visible = true;

        tt(t: string): string {
            return this.$t((this.event.isChecklist ? 'checklist' : 'task') + '.' + t).toString();
        }

        deleteEvent(): void {
            EventService.deleteById(this.event.id).then(() => {
                this.visible = false;
            });
        }
    }

</script>

<style scoped>
    .event {
        max-width: 600px;
        padding: 10px;
        margin: 20px auto;
    }

    .comment {
        padding: 10px;
        margin: 10px;
    }

    .actionBar {
        width: 100%;
        display: flow-root;
    }

    .task-name::before, .task-name::after {
        content: '"';
    }
</style>
