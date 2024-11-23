import { statusOptions } from '@/constants';
import { $t } from '@/locales/i18n';
import { editFormSchemaUtil, isPhone } from '@/utils';
import { FormItemRule } from 'naive-ui';
import { computed, unref } from 'vue';

// 性别选项配置
const sexOptions = computed(() => [
  { label: $t('user.male'), value: 'MALE' },
  { label: $t('user.female'), value: 'FEMALE' },
  { label: $t('user.other'), value: 'OTHER' },
]);

// 表格和表单配置函数
export const useUserInfoSchema = (methods: any, data: any) => {
  const schema = computed(() => ({
    properties: [
      {
        key: 'username',
        label: $t('common.username'),
        defaultValue: undefined,
        editForm: {
          component: 'NInput',
          rules: [
            {
              required: true,
            },
          ],
          componentProps: {
            disabled: true,
          },
        },
      },
      {
        key: 'phone',
        label: $t('user.phone'),
        defaultValue: undefined,
        editForm: {
          component: 'NInput',
          componentProps: {
            placeholder: '请输入手机号',
            showButton: false,
            maxlength: 11,
            showCount: true,
          },
          rules: [
            {
              type: 'string',
              required: true,
              trigger: ['blur', 'input'],
              validator: (_rule: FormItemRule, value: string) => {
                if (!value) {
                  return new Error('请输入手机号');
                }
                if (isPhone(value)) {
                  return true;
                }
                return new Error('请输入正确的手机号');
              },
            },
          ],
        },
        table: {
          render: (row: any) => row.phone || '-',
        },
      },
      {
        key: 'name',
        label: $t('user.name'),
        defaultValue: undefined,
        editForm: {
          component: 'NInput',
          componentProps: {
            placeholder: '请输入昵称/姓名',
            maxlength: 8,
            showCount: true,
          },
          rules: [
            {
              type: 'string',
              required: true,
              trigger: ['blur', 'input'],
              validator: (_rule: FormItemRule, value: string) => {
                if (!value) {
                  return new Error('请输入昵称');
                }
                if (value.length < 2) {
                  return new Error('昵称长度不能少于2位');
                }
                if (value.length > 8) {
                  return new Error('昵称长度不能超过8位');
                }
                return true;
              },
            },
          ],
        },
      },
      {
        key: 'sex',
        label: $t('user.sex'),
        defaultValue: undefined,
        editForm: {
          component: 'NRadioGroup',
          componentProps: {
            placeholder: `${$t('common.pleaseSelect')} ${$t('user.sex')}`,
            options: unref(sexOptions),
          },
        },
      },
      {
        key: 'status',
        label: $t('common.status'),
        defaultValue: [0, 1],
        editForm: {
          component: 'NRadioGroup',
          defaultValue: 0,
          labelMessage: '请联系管理员更新激活状态',
          componentProps: {
            placeholder: '请选择状态',
            options: unref(statusOptions),
            disabled: true,
          },
        },
      },
      {
        key: 'email',
        label: $t('user.email'),
        defaultValue: undefined,
        editForm: {
          component: 'NInput',
          componentProps: {
            placeholder: '请输入邮箱',
          },
          rules: [
            {
              type: 'string',
              required: false,
              trigger: ['blur', 'input'],
              validator: (_rule: FormItemRule, value: string) => {
                if (!value) {
                  return new Error('请输入邮箱');
                }
                const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                if (reg.test(value)) {
                  return true;
                }
                return new Error('请输入正确的邮箱');
              },
            },
          ],
        },
      },
      {
        key: 'birthday',
        label: $t('user.birthday'),
        defaultValue: undefined,
        editForm: {
          component: 'NDatePicker',
          componentProps: {
            placeholder: '请选择生日',
          },
        },
      },
      {
        key: 'city',
        label: $t('user.city'),
        defaultValue: undefined,
        editForm: {
          component: 'NCascader',
          componentProps: {
            options: unref(data.addressOptions),
            placeholder: '请选择地址',
            labelField: 'name',
            valueField: 'adcode',
            childrenField: 'districts',
            checkStrategy: 'child',
            onUpdateValue: methods.addressUpdate,
          },
        },
      },
      {
        key: 'address',
        label: $t('user.address'),
        defaultValue: undefined,
        editForm: {
          component: 'NInput',
          giProps: { span: 2 },
          componentProps: {
            type: 'textarea',
            placeholder: '请输入详细地址',
            maxlength: 200,
            showCount: true,
          },
        },
      },
    ],
  }));

  const editFormFields = [
    'username',
    'phone',
    'name',
    'email',
    'sex',
    'status',
    'birthday',
    'city',
    'address',
  ];

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));
  return { editFormSchemas };
};
