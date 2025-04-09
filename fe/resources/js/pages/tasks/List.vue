<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import {Head, usePage} from '@inertiajs/vue3';
import {Eye, FilePenLine, LoaderCircle, PlusCircle, Trash2} from "lucide-vue-next";
import {http} from "@/utils";
import {computed, ref} from "vue";
import {statusMap} from "@/constants.js";
import {Button} from "@/components/ui/button/index.js";

const page = usePage();
const user = computed(() => page.props.auth.user);

const breadcrumbs = [
  {
    title: 'Tasks',
    href: '/tasks',
  },
];

const can = (user, task) => {
  return task.userId === user.id || user.role === 'admin';
}
const tasksRef = ref();
const props = defineProps({
  status: {
    type: String,
    required: false
  }
})
const fetchDataFunction = async () => {
  const { data: dataResponse } = await http.get(route('api.task.index'));
  let tasks = {}

  if (dataResponse.data.length > 0) {
    const originalData = dataResponse.data;
    for (let i = 0; i < originalData.length; i++) {
      let tmp = originalData[i];
      let tmpId = '';
      if (!tmp.parent) {
        tasks[tmp.id] = {...{subTasks: [], expand: false}, ...tmp};
      } else {
        if (tasks[tmp.parent.id]) {
          tmpId = tmp.parent.id;
          delete (tmp.parent);
          if (!tasks[tmpId]['subTasks']) {
            tasks[tmpId]['subTasks'] = [tmp];
          } else {
            tasks[tmpId]['subTasks'].push(tmp);
          }
        } else {
          tmpId = tmp.parent.id;
          tasks[tmpId] = {...{subTasks: [], expand: false}, ...tmp.parent};
          delete (tmp.parent);
          tasks[tmpId]['subTasks'].push(tmp);
        }
      }
    }
    tasks = Object.values(tasks);
    tasksRef.value = tasks;
  }
}
fetchDataFunction();

const toggleExpand = (index) => {
  tasksRef['value'][index]['expand'] = !tasksRef['value'][index]['expand'];
}
const redirect = (page, item) => {
  let url = '';
  switch (page) {
    case 'view':
      url = route('task.detail', {'id': item.id});
      break;
    case 'viewSubTask':
      url = route('subtask.detail', {'id': item.id});
      break;
  }
  window.open(url, "_blank");
}
</script>

<template>
  <Head title="Tasks"/>

  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex flex-col h-full p-4" style="flex-basis:content">
      <div v-if="status" class="mb-4 text-center text-sm font-medium text-green-600">
        {{ status }}
      </div>
      <div class="sm:w-full md:w-5/6 m-auto">
        <Button variant="default" class="rounded-md px-3.5 py-1.5 mb-3 float-right"  @click="redirect('create')">
          <PlusCircle class="h-4 w-4" />
          Add task
        </Button>
      </div>
      <table
          class="sm:w-full table-fixed md:w-5/6 text-sm text-left m-auto rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th class="w-[45px]"></th>
          <th scope="col" class="px-3 py-2 w-3/12">
            Title
          </th>
          <th scope="col" class="px-3 py-2 w-6/12">
            Description
          </th>
          <th scope="col" class="px-3 py-2 w-[130px]">
            Status
          </th>
          <th scope="col" class="px-3 py-2">
            Action
          </th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(item, index) in tasksRef"
                  :key="index">
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="p-4 delay-80 duration-700 transition hover:cursor-pointer" :class="{ 'rotate-90': item.expand}" @click="toggleExpand(index)">
              <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 8 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"></path>
              </svg>
            </td>
            <td class="px-3 py-2">
              {{ item.title }}
            </td>
            <td class="px-3 py-2">
              {{ can(user, item) ? item.description : '' }}
            </td>
            <td class="px-3 py-2 text-left">
              {{ can(user, item) ? statusMap[item.status] : '' }}
            </td>
            <td class="px-3 py-2 text-left">
              <button v-if="can(user, item)" @click="redirect('view', item)"
                      class="'flex items-center rounded-md px-3.5 py-1.5 transition-colors text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60">
                <component :is="Eye" class="-ml-1 h-4 w-4"/>
              </button>
            </td>
          </tr>
          <tr v-if="item.subTasks.length > 0">
            <td colspan="5" class="delay-90 duration-700 transition" v-if="item.expand">
              <table
                  class="w-full table-fixed text-sm text-left m-auto rtl:text-right text-gray-500 dark:text-gray-400">
                <tbody>
                <tr v-for="(subTask, subIndex) in item.subTasks"
                     :key="subIndex">
                  <td class="w-[45px]"></td>
                  <td class="pl-5 pr-3 py-2 w-3/12">{{ subTask.title }}</td>
                  <td class="px-3 py-2 w-6/12">{{ subTask.title }}</td>
                  <td class="px-3 py-2 w-[130px]"> {{ statusMap[subTask.status] }}</td>
                  <td class="px-3 py-2">
                    <button v-if="can(user, subTask)" @click="redirect('viewSubTask', subTask)"
                            class="'flex items-center rounded-md px-3.5 py-1.5 transition-colors text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60">
                      <component :is="Eye" class="-ml-1 h-4 w-4"/>
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </AppLayout>
</template>
