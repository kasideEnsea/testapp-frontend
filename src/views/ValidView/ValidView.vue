<template>
    <v-container>
        <v-row class="text-center">
            <v-col class="mb-4">
                <h1 class="display-2 font-weight-bold mb-3">
                    Проверка почты...
                </h1>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from "vue-property-decorator";
    import {ValidOptions} from "@/models/ValidOptions";
    import {RegistrationService} from "@/security/RegistrationService";

    @Component
    export default class ValidView extends Vue {
        private options = new class implements ValidOptions {
            id = 0;
            code = "";
        };

        created() {
            this.options.id = +this.$route.params.userId;
            this.options.code = this.$route.params.code;
            RegistrationService.validate(this.options).then(() => {
                this.$router.push("/");
            }).catch(reason => {
                this.$router.push("/novalid");
            });
        }
    }
</script>
