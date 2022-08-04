<i18n src="./MainView.yaml"/>
<template>
    <div class="mx-auto" style="max-width: 1000px;">
        <h1>{{$t('title')}}</h1>
    </div>
</template>

<script lang="ts">
    import {State} from "@/enum/State";
    import {AuthService} from "@/security/AuthService";
    import {Vue, Watch} from "vue-property-decorator";
    import {TitleService} from "@/services/TitleService";
    import Component from "vue-class-component";

    @Component({})
    export default class MainView extends Vue {
        private state = State.None;
        private errCode = 0;
        private errorDict!: Record<number, string>
        private valid = false;

        get getErrorDescription(): string {
            const error = this.errorDict[this.errCode];
            if (error)
                return error;
            else
                return this.$t('error.default', {errCode: this.errCode}).toString();
        }

        get isLoading(): boolean {
            return this.state == State.Loading;
        }

        get isSuccess(): boolean {
            return this.state == State.Success;
        }

        get isError(): boolean {
            return this.state == State.Error;
        }

        get titleString(): string {
            return 'LinGo';
        }

        created() {
            this.setTitle();
            this.errorDict = {
                401: this.$t('error.401').toString(),
                403: this.$t('error.403').toString(),
            };
        }

        @Watch("$i18n.locale")
        private setTitle() {
            TitleService.setTitle(this.$t('title').toString());
        }

        get submitDisabled(): boolean {
            return this.isLoading || !this.valid;
        }
    }
</script>

<style scoped>
    .reg {
        margin-left: auto;
        margin-right: auto;
    }
</style>
