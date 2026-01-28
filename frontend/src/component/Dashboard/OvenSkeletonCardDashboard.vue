<script lang="ts" setup>
interface OvenSkeletonCardProps {
    count: number;
}
defineProps<OvenSkeletonCardProps>();
</script>

<template>
    <div class="flex flex-wrap gap-5 items-center justify-center">
        <Skeleton width="19rem" height="10rem" v-for="_i in count"></Skeleton>
    </div>
</template>