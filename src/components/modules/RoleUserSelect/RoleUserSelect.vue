<template>
  <div class="component-role-user-select">
    <n-flex vertical>
      <n-form-item
        ref="formRef"
        :label="$t('component.roleUserSelect')"
        label-placement="left"
        required
        :rule="rule"
      >
        <template #label v-if="getProps.showLabelMessage">
          {{ $t('component.roleUserSelect') }}
          <NTooltip trigger="hover">
            <template #trigger>
              <JayIcon :icon="'mynaui:question-waves'" :hover="true" :size="14" />
            </template>
            {{ $t('message.roleUserSelectTip') }}
          </NTooltip>
        </template>
        <n-tree-select
          ref="treeSelectRef"
          multiple
          checkable
          cascade
          filterable
          :options="roleUserOptions"
          children-field="users"
          check-strategy="parent"
          :renderTag="renderTag"
          :max-tag-count="5"
          :value="selectedKeys"
          @update:value="handleUpdateValue"
        />
      </n-form-item>

      <n-alert
        :title="`${$t('component.message.sent')} ${sentCount} ${$t('common.people')}`"
        type="warning"
        v-if="sentCount"
      >
        {{ $t('component.message.selectRoleUserSentTip') }}
      </n-alert>

      <n-alert class="mb-20px" v-if="userCount" type="success">
        {{ `${$t('common.totalSelect')} ${userCount} ${$t('common.people')}` }}
      </n-alert>

      <n-collapse>
        <n-collapse-item
          v-for="(item, index) in selectedData"
          :key="index"
          :title="`${item.role} (${$t('common.total')}${item.users.length}${$t('common.people')})`"
          :name="item.role"
        >
          <n-space>
            <n-tag
              :type="updateDuplicateNames(user) ? 'warning' : 'primary'"
              v-for="(user, idx) in item.users"
              :key="index + '-' + idx"
            >
              {{ user }}
            </n-tag>
          </n-space>
        </n-collapse-item>
      </n-collapse>
    </n-flex>
  </div>
</template>

<script setup lang="tsx">
import { RoleApi } from '@/api';
import { $t } from '@/locales';
import { isNumber } from 'lodash';
import { TreeSelectOption, TreeSelectRenderTag } from 'naive-ui';
import { VNodeChild, useTemplateRef } from 'vue';

interface RoleUserOptions extends TreeSelectOption {
  users: RoleUserOptions[];
}

interface UserSelectOption extends System.User {
  key: string | number;
  label: string;
  disabled?: boolean;
}

const props = defineProps({
  showLabelMessage: {
    type: Boolean,
    default: true,
  },
  selectedUserIds: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
});

const getProps = computed(() => {
  return {
    ...props,
  };
});

const treeSelectRef = useTemplateRef<any>('treeSelectRef');
const formRef = useTemplateRef<any>('formRef');
const roleUserOptions = ref<any>([]);
const selectedKeys = ref<Array<string | number>>([]);
const roleUserMap = ref<{ [key: number]: UserSelectOption[] }>({});
const roleIdNameMap = ref<{ [key: number]: string }>({});
const duplicateNames = ref<string[]>([]);
const allUsers = ref<string[]>([]);
const allUserIds = ref<number[]>([]);

const rule = {
  trigger: ['input', 'blur'],
  validator() {
    if (selectedKeys.value.length === 0) {
      return new Error($t('component.message.selectUserTip'));
    }
  },
};

onMounted(() => {
  loadAllRole();
});

const validateFn = () => {
  return formRef.value.validate();
};

const getSelectUsers = () => {
  return userSelect.value;
};

// 判断是否重复
const updateDuplicateNames = (user: string) => {
  return duplicateNames.value.includes(user);
};

// 总选中人id-过滤重复
const userSelect = computed(() => {
  return Array.from(new Set(allUserIds.value));
});

const sentCount = computed(() => {
  return getProps.value.selectedUserIds.length;
});

// 总选中人数-过滤重复
const userCount = computed(() => {
  return Array.from(new Set(allUsers.value)).length;
});

// 获取选中的数据,用户回显
const updateSelectedData = () => {
  const displayData: { role: string; users: string[] }[] = [];
  allUsers.value = [];
  selectedKeys.value.forEach((key: string | number) => {
    if (isNumber(key)) {
      // 获取角色(包含用户users)
      const users: string[] = roleUserMap.value[key]
        .filter((user: any) => {
          return !user.disabled;
        })
        .map((user: UserSelectOption) => {
          allUserIds.value.push(user.id);
          return user.name || `${user.username} (${$t('message.notSetName')})`;
        });
      allUsers.value.push(...users);
      displayData.push({
        role: unref(roleIdNameMap)[key],
        users,
      });
    } else {
      const [roleIdStr, userIdStr] = key.split('-');
      const roleId = Number(roleIdStr);
      const userId = Number(userIdStr);
      const role = unref(roleIdNameMap)[roleId];
      const user = unref(roleUserMap)[roleId].find((user: UserSelectOption) => user.id === userId);
      const userName = user?.name || `${user?.username} (${$t('message.notSetName')})`;
      allUserIds.value.push(userId);
      const exists = displayData.find((item: any) => item.role === role);
      allUsers.value.push(userName);
      exists ? exists.users.push(userName) : displayData.push({ role, users: [userName] });
    }
  });
  duplicateNames.value = Array.from(
    new Set(
      allUsers.value.filter(
        (item: string, index: number, arr: string[]) => arr.indexOf(item) !== index,
      ),
    ),
  );
  return displayData;
};

// 获取选中的数据,用户回显
const selectedData = computed(() => {
  return updateSelectedData();
});

// 加载所有角色-用户
const loadAllRole = async () => {
  const res = await RoleApi.roleList({
    options: JSON.stringify({ showPagination: false, with_user: true }),
  });
  // 处理一个人对应多个角色，直接选中一整个角色的时候，会选到其他角色下的该用户
  const newOptions = res.data.map((item: any) => {
    let disabledUserCount = 0;
    item.users.forEach((user: UserSelectOption) => {
      if (getProps.value.selectedUserIds.includes(user.id)) {
        user.disabled = true;
        disabledUserCount++;
      }
    });
    if (disabledUserCount === item.users.length) {
      item.disabled = true;
    }
    // 角色下所有用户的id映射表
    unref(roleUserMap)[item.id] = item.users.map((user: UserSelectOption) => user);
    unref(roleIdNameMap)[item.id] = item.name;
    return {
      ...item,
      key: item.id,
      label: `${item.name} - (${$t('common.total')}${item.users.length}${$t('common.people')})`,
      users: item.users.map((user: any) => {
        return {
          ...user,
          key: `${item.id}-${user.id}`,
          label: user.name || `${user.username} (${$t('message.notSetName')})`,
        };
      }),
    };
  });

  roleUserOptions.value = newOptions;
};

const renderTag: TreeSelectRenderTag = (props: {
  option: TreeSelectOption;
  handleClose: () => void;
}): VNodeChild => {
  const option = props.option as RoleUserOptions;
  if (option.users) {
    return (
      <n-tag type="info" closable onClose={props.handleClose}>
        {option.label}
      </n-tag>
    );
  }
  return (
    <n-tag type="default" closable onClose={props.handleClose}>
      {option.label}
    </n-tag>
  );
};

const handleUpdateValue = async (value: Array<string | number>) => {
  // 确保数组元素按照数字优先排列，字符串往后
  selectedKeys.value = value.sort((a, b) => {
    const isANumber = typeof a === 'number';
    const isBNumber = typeof b === 'number';

    if (isANumber && isBNumber) {
      return a - b;
    }
    if (isANumber) {
      return -1;
    }
    if (isBNumber) {
      return 1;
    }
    return a.toString().localeCompare(b.toString());
  });
};

defineExpose({
  validate: validateFn,
  getSelectUsers,
});
</script>

<style scoped lang="scss"></style>
