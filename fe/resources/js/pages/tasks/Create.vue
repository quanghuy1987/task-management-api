<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import {Head, useForm} from '@inertiajs/vue3';
import {ref} from "vue";
import {Label} from "@/components/ui/label/index.js";
import {Input} from "@/components/ui/input/index.js";
import {LoaderCircle} from "lucide-vue-next";
import {http} from "@/utils/index.js";
import {statusMap} from "@/constants.js";
import {Button} from "@/components/ui/button/index.js";
import InputError from "@/components/InputError.vue";

const breadcrumbs = [
  {
    title: 'Tasks',
    href: '/tasks',
  },
];
let form = useForm({
  title: null,
  description: null,
  status: null,
  userId: null,
});
const users = ref([]);
const isLoading = ref(true)
const props = defineProps({
  id: {
    type: String,
    required: false
  },
  parentId: {
    type: String,
    required: false
  }
});
const fetchDataFunction = async () => {
  if (props.id) {
    const {data: dataResponse} = await http.get(route('api.task.detail', {id: props.id}));
    let tmpResponse = { ...dataResponse.data};
    if (tmpResponse.parent) {
      tmpResponse.taskId = tmpResponse.parent.id;
      delete tmpResponse.parent;
    }
    form = useForm(tmpResponse);
    console.log(form);
  }
  isLoading.value = false;
}
const fetchUsers = async () => {
  const {data: dataResponse} = await http.get(route('api.user.index'));
  users.value = dataResponse.data.map((item) => {
    return {
      id: item.id,
      email: item.email,
      name: item.name
    }
  })
}
fetchUsers();
fetchDataFunction();

const submit = () => {
  if (props.id) {
    form.put(route('task.put.update', {id: props.id}))
  } else {
    form.post(route('task.post.store'));
  }
};
</script>

<template>
  <Head title="Task Detail"/>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex h-full p-4" style="flex-basis:content">
      <form @submit.prevent="submit" class="sm:w-full table-fixed md:w-3/6 m-auto" v-if="!isLoading">
        <div class="grid gap-6">
          <div class="grid gap-2">
            <Label for="Title">Title</Label>
            <Input
                id="Title"
                type="text"
                :tabindex="1"
                v-model="form.title"
            />
            <InputError :message="form.errors.title" class="mt-2" />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <Label for="description">Description</Label>
            </div>
            <textarea
                id="description"
                :tabindex="2"
                rows="5"
                class="rounded-md border border-input p-2 focus-visible:outline-none focus-visible:shadow-md focus-visible:shadow-cyan-700/80"
                v-model="form.description"
            />
            <InputError :message="form.errors.description" class="mt-2" />
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div class="col-span-3 flex items-center justify-between">
              <Label for="assignee">Assignee</Label>
            </div>
            <select id="assignee" v-model="form.userId" :tabindex="3" class="rounded-md border border-input p-2">
              <option disabled value="">Please select one</option>
              <option v-for="(item, index) in users" :key="item.id" :value="item.id"> {{ item.name + ' - ' + item.email }}</option>
            </select>
            <InputError :message="form.errors.userId" class="mt-2" />
          </div>
          <div class="grid grid-cols-4 gap-2">
            <div class="col-span-4 flex items-center justify-between">
              <Label for="status">Status</Label>
            </div>
            <select id="status" v-model="form.status" :tabindex="3" class="rounded-md border border-input p-2">
              <option disabled value="">Please select one</option>
              <option v-for="(item, index) in statusMap" :key="index" :value="index"> {{ item }}</option>
            </select>
            <InputError :message="form.errors.status" class="col-span-4 mt-2" />
          </div>
        </div>
        <div class="flex items-center mt-2 justify-center">
          <Button class="sm:w-full md:w-1/6 m-auto" :disabled="form.processing">
            <LoaderCircle v-if="form.processing" class="h-4 w-4 animate-spin" />
            Submit
          </Button>
        </div>
      </form>
      <div class="mx-auto w-full p-4 max-w-sm" v-else>
        <LoaderCircle class="w-[8rem] h-[8rem] animate-spin"/>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>

</style>
