<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import {Head} from '@inertiajs/vue3';
import {ref} from "vue";
import {Label} from "@/components/ui/label/index.js";
import {Input} from "@/components/ui/input/index.js";
import {LoaderCircle} from "lucide-vue-next";
import {http} from "@/utils/index.js";
import {statusMap} from "@/constants.js";

const breadcrumbs = [
  {
    title: 'Tasks',
    href: '/tasks',
  },
];
const form = ref();
const isLoading = ref(true)
const props = defineProps({
  id: {
    type: String,
    required: true
  }
});
const fetchDataFunction = async () => {
  const {data: dataResponse} = await http.get(route('api.task.detail', {id: props.id}));
  form.value = {...dataResponse.data};
  isLoading.value = false;
}
fetchDataFunction();
</script>

<template>
  <Head title="Task Detail"/>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex h-full p-4" style="flex-basis:content">
      <div class="sm:w-full table-fixed md:w-3/6 m-auto" v-if="!isLoading">
        <div class="grid gap-6">
          <div class="grid gap-2">
            <Label for="Title">Title</Label>
            <Input
                id="Title"
                type="text"
                :tabindex="1"
                v-model="form.title"
                readonly
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <Label for="description">Description</Label>
            </div>
            <textarea
                id="description"
                readonly
                :tabindex="2"
                rows="5"
                class="rounded-md border border-input p-2 focus-visible:outline-none focus-visible:shadow-md focus-visible:shadow-cyan-700/80"
                v-model="form.description"
            />
          </div>
          <div class="grid gap-2" v-if="form.parent">
            <div class="grid grid-cols-4 gap-2">
              <div class="col-span-4 flex items-center justify-between">
                <Label for="parentTask">Parent Task</Label>
              </div>
              <select id="status" v-model="form.parent.id" :tabindex="3" disabled class="rounded-md border border-input p-2">
                <option :value="form.parent.id"> {{ form.parent.title }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <div class="col-span-4 flex items-center justify-between">
              <Label for="status">Status</Label>
            </div>
            <select id="status" v-model="form.status" :tabindex="3" disabled class="rounded-md border border-input p-2">
              <option disabled value="">Please select one</option>
              <option v-for="(item, index) in statusMap" :key="index" :value="index"> {{ item }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="mx-auto w-full p-4 max-w-sm" v-else>
        <LoaderCircle class="w-[8rem] h-[8rem] animate-spin"/>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>

</style>
