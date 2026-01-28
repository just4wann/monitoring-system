<script lang="ts" setup>
import { ref } from 'vue';
import { useToast } from 'primevue';
import { UserAPI } from '../composables';
import { useRouter } from 'vue-router';

import Logo from '../component/Logo.vue';

const router = useRouter();
const toast = useToast();
const password = ref<string>('');
const roles = ref<string>('');
const roleName = ref<string>('');
const showModal = ref<boolean>(false);

const setRoles = (role: string) => {
    role === 'prods' ? roleName.value = 'Production' : 
    role === 'qc' ? roleName.value = 'Quality Control' : '';
    roles.value = role;
    if (role == 'guest') {
        localStorage.setItem('token', 'guest');
        router.push('/');
        return;
    };
    showModal.value = true;
}

const handleLogin = async () => {
    const res = await UserAPI.userLogin(roles.value, password.value);
    if (!res.data) {
        toast.add({
            summary: 'Error',
            detail: 'Login Failed',
            severity: 'error',
            life: 3000
        })
        password.value = '';
        showModal.value = false;
        return;
    }
    if (!res.data.accessToken) {
        toast.add({
            summary: 'Error',
            detail: 'Login Failed',
            severity: 'error',
            life: 3000
        })
        password.value = '';
        showModal.value = false;
        return;
    }
    password.value = '';
    showModal.value = false;
    localStorage.setItem('token', res.data.accessToken);
    router.push('/');
}
</script>

<template>
    <main class="flex justify-center items-center mt-10">
        <Card class="p-5">
            <template #content>
                <div class="flex flex-col gap-8 items-center justify-center">
                    <Logo :size="200"/>
                    <h1 class="text-2xl pnsc-bold text-slate-800">Welcome to Panasonic Monitoring System</h1>
                    <section class="flex flex-col text-slate-600 w-full">
                        <p class="text-md">Signed in as</p>
                        <div class="flex justify-center items-center gap-20 mt-5">
                            <Dialog v-model:visible="showModal" modal >
                                <template #header>
                                    <p class="text-md">Enter Password</p>
                                </template>
                                <section class="flex flex-col gap-5 text-sm">
                                    <div class="flex flex-col-reverse gap-1">
                                        <IconField>
                                          <InputIcon class="pi pi-user" />
                                          <InputText id="pr" size="small" v-model="roleName" variant="filled" class="w-full" disabled/>
                                        </IconField>
                                        <label for="pr">Role</label>
                                    </div>
                                    <div class="flex items-end">
                                        <div class="flex flex-col-reverse gap-1">
                                            <IconField>
                                              <InputIcon class="pi pi-lock" />
                                              <Password v-model="password" size="small" toggleMask :feedback="false" id="pw"/>
                                            </IconField>
                                            <label for="pw">Password</label>
                                        </div>
                                        <Button class="ml-2" label="Sign In" type="button" @click="handleLogin" :disabled="password === ''" icon="pi pi-sign-in" severity="contrast" size="small"/>
                                    </div>
                                </section>
                           </Dialog>
                            <div class="flex flex-col gap-1 items-center">
                                <p class="text-sm">Production</p>
                                <button @click="setRoles('prods')">
                                    <Avatar icon="pi pi-hammer" size="large" shape="circle" style="background-color: #ece9fc; color: #2a1261;"/>
                                </button>
                            </div>
                            <div class="flex flex-col gap-1 items-center">
                                <p class="text-sm">Quality Control</p>
                                <button @click="setRoles('qc')">
                                    <Avatar icon="pi pi-eye" size="large" shape="circle" style="background-color: #dee9fc; color: #1a2551;"/>
                                </button>
                            </div>
                        </div>
                        <Divider>
                            <p class="text-xs">OR</p>
                        </Divider>
                        <div class="flex flex-col gap-1 items-center">
                                <p class="text-sm">Guest</p>
                                <button @click="setRoles('guest')">
                                    <Avatar icon="pi pi-user" size="large" shape="circle" style="background-color: #dee9fc; color: #1a2551;"/>
                                </button>
                            </div>
                    </section>
                </div>
            </template>
        </Card>
        <Toast/>
    </main>
    <!-- <input type="text" v-model="roles" placeholder="roles">
    <input type="text" v-model="password" placeholder="password">
    <button @click="handleLogin">login</button> -->
</template>