<i18n src="./SummaryCard.yaml"/>
<template>
    <v-card style="margin: 20px; padding: 20px;">
        <h2 class="text-center">{{$t('title')}}</h2>
        <div v-if="state === State.Loading">{{$t('loading')}}</div>
        <div v-else-if="state === State.Error">{{$t('error')}}</div>
        <div v-else-if="state === State.Success">
            <table style="width: 100%">
                <tr>
                    <td :key="i" v-for="(date, i) in Object.keys(summary)">
                        {{date}}
                    </td>
                </tr>
                <tr>
                    <td :key="i"
                        :style="`background-color:rgba(0, 0, 255, ${arr[1] && max ? arr[1] / max : 0})!important`"
                        class="info"
                        v-for="(arr, i) in Object.values(summary)">
                        {{arr[0]}}
                    </td>
                </tr>
            </table>
        </div>
    </v-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import LanguageSelector from "@/components/Header/LanguageSelector.vue";
    import Datetime from "@/components/Datetime.vue";
    import DateEditor from "@/components/DateEditor/DateEditor.vue";
    import {UserSummaryService} from "@/services/UserSummaryService";
    import {State} from "@/enum/State";

    @Component({
        components: {DateEditor, Datetime, LanguageSelector}
    })
    export default class SummaryCard extends Vue {
        daysNumber = 7;
        @Prop() userId!: number;
        summary: Record<string, Array<number>> = {};
        State = State;
        state: State = State.None;
        max = 0;
        private dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };

        created() {
            const date = new Date()
            date.setDate(date.getDate() - this.daysNumber + 1);
            for (let i = 0; i < this.daysNumber; i++, date.setDate(date.getDate() + 1)) {
                this.summary[this.formatDate(date)] = [0, 0];
            }

            this.state = State.Loading;
            UserSummaryService.getUserSummary(this.userId).then(value => {
                this.max = Math.max(...value.data.map(v1 => v1.rate));
                value.data.forEach(value1 => this.summary[this.formatDate(value1.date)] = [value1.count, value1.rate]);
                this.state = State.Success;
            }).catch(reason => {
                console.error(reason);
                this.state = State.Error;
            });
        }

        formatDate(date: Date): string {
            const dateTimeFormat = new Intl.DateTimeFormat(this.$i18n.locale.toString(), this.dateTimeFormatOptions);
            return dateTimeFormat.format(new Date(date));
        }
    }

</script>

<style scoped>
    h2 {
        margin-bottom: 20px;
    }

    td {
        width: 100px;
    }

    td.info {
        height: 100px;
        vertical-align: middle;
        text-align: center;
        font-size: 32pt;
        color: orange;
    }
</style>
