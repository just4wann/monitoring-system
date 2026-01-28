<script lang="ts" setup>
import { ref, watch } from 'vue';
import { store } from '../store';

interface NavigationEmits {
  page: [val: string]
}

const emits = defineEmits<NavigationEmits>();

const pageIndication = ref<string>('');

const items = ref([
  {
    label: 'Dashboard',
    icon: 'pi pi-objects-column',
    command: () => {
      pageIndication.value = 'Dashboard'
    }
  },
  {
    label: 'Record',
    icon: 'pi pi-book',
    command: () => {
      pageIndication.value = 'Record'
    }
  },
  {
    label: 'Judgements',
    icon: 'pi pi-list-check',
    command: async () => {
      pageIndication.value = 'Judgements';
    }
  },
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => {
      pageIndication.value = 'Profile'
    }
  },
]);

watch(pageIndication, (newVal, _oldVal) => {
    emits('page', newVal)
})
</script>
<template>
    <Menu :model="items" class="w-12">
      <template #item="{ item, props }">
        <a v-ripple class="flex justify-start items-center ml-5" v-bind="props.action">
          <span :class="item.icon" class="mr-1" style="font-size: 0.7rem;"/>
          <span class="text-sm">{{ item.label }}</span>
          <Badge v-if="item.label == 'Judgements' && store.notifications.length > 0" rounded :value="store.notifications.length" severity="danger" size="small"/>
        </a>
      </template>
    </Menu>
</template>