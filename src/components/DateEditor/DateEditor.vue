<i18n src="./DateEditor.yaml"/>
<template>
    <v-menu
            :close-on-content-click="false"
            :return-value.sync="date"
            min-width="290px"
            offset-y
            ref="menu"
            transition="scale-transition"
            v-model="menu"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                    :label="label"
                    :value="formatted"
                    prepend-icon="mdi-calendar"
                    readonly
                    style="max-width: 300px"
                    v-bind="attrs"
                    v-on="on"
            ></v-text-field>
        </template>
        <v-date-picker
                :first-day-of-week="1"
                :locale="$i18n.locale"
                no-title
                scrollable
                v-model="date"
        >
            <v-spacer></v-spacer>
            <v-btn
                    @click="menu = false"
                    color="primary"
                    text
            >
                {{$t('cancel-button')}}
            </v-btn>
            <v-btn
                    @click="$refs.menu.save(date)"
                    color="primary"
                    text
            >
                {{$t('ok-button')}}
            </v-btn>
        </v-date-picker>
    </v-menu>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";

    @Component({})
    export default class DateEditor extends Vue {
        @Prop() label?: string;
        @Prop() value?: Date
        date: Date | null = this.value || null;
        menu = false;

        private dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "long",
            year: "numeric"
        };

        get formatted(): string {
            if (!this.date)
                return '';
            const dateTimeFormat = new Intl.DateTimeFormat(this.$i18n.locale.toString(), this.dateTimeFormatOptions);
            return dateTimeFormat.format(new Date(this.date.toString()));
        }

        @Watch("date")
        private push(val: Date | null): void {
            this.$emit('input', val);
        }
    }
</script>

<style scoped>
</style>
