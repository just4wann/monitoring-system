<script lang="ts" setup>
interface RoleInfoProps {
    role: string | null;
}
defineProps<RoleInfoProps>();
</script>

<template>
    <div class="flex flex-col items-center gap-2 mt-10">
        <Avatar 
            :icon="role == 'prods' ? 'pi pi-hammer' : role == 'guest' ? 'pi pi-user' : 'pi pi-eye'" 
            size="large"
            shape="circle"
            :style="role == 'prods' ? 'background-color: #ece9fc; color: #2a1261;' : 'background-color: #dee9fc; color: #1a2551;'"
        />
        <p class="text-sm">{{ role == 'prods' ? 'Production' : role == 'guest' ? 'Guest' : 'Quality Control' }}</p>
    </div>
</template>