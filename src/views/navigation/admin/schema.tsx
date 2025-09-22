import { NavigationApi } from '@/api';
import { FormItemRule } from 'naive-ui';

/**
 * 创建弹窗表单配置
 */
export const useCreateModalSchema = () => {
  /**
   * 获取表单配置
   * @param type 表单类型：'group' | 'navigation'
   */
  const getFormSchemas = (type: 'group' | 'navigation') => {
    if (type === 'group') {
      return getGroupFormSchemas();
    }
    return getNavigationFormSchemas();
  };

  /**
   * 分组表单配置
   */
  const getGroupFormSchemas = () => [
    {
      field: 'name',
      label: '分组名称',
      component: 'NInput',
      required: true,
      rules: [
        {
          type: 'string',
          required: true,
          trigger: ['blur', 'input'],
          validator: (_rule: FormItemRule, value: string) => {
            if (!value) {
              return new Error('请输入分组名称');
            }
            if (value.length < 2) {
              return new Error('分组名称长度不能少于2个字符');
            }
            if (value.length > 20) {
              return new Error('分组名称长度不能超过20个字符');
            }
            return true;
          },
        },
      ],
      componentProps: {
        placeholder: '请输入分组名称',
        maxlength: 20,
        showCount: true,
      },
    },
    {
      field: 'icon',
      label: '分组图标',
      component: 'IconPicker',
      required: true,
      rules: [
        {
          required: true,
          message: '请选择分组图标',
          trigger: ['blur', 'change'],
        },
      ],
      componentProps: {
        placeholder: '请选择分组图标',
      },
    },
    {
      field: 'description',
      label: '分组描述',
      component: 'NInput',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入分组描述（可选）',
        autosize: { minRows: 2, maxRows: 4 },
        maxlength: 200,
        showCount: true,
      },
    },
    {
      field: 'sortOrder',
      label: '排序',
      component: 'NInputNumber',
      defaultValue: 0,
      componentProps: {
        placeholder: '请输入排序值',
        min: 0,
        max: 9999,
        step: 1,
        precision: 0,
      },
    },
    {
      field: 'status',
      label: '状态',
      component: 'NRadioGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
  ];

  /**
   * 导航表单配置
   */
  const getNavigationFormSchemas = () => [
    // {
    //   field: 'groupId',
    //   label: '分组ID',
    //   component: 'NInput',
    //   required: true,
    //   componentProps: {
    //     disabled: true,
    //     placeholder: '分组ID将自动设置',
    //   },
    // },
    {
      field: 'groupIds',
      label: '所属分组',
      defaultValue: [],
      component: 'ApiSelect',
      required: true,
      rules: [
        {
          required: true,
          message: '请选择所属分组',
          trigger: ['blur', 'change'],
          validator: (_rule: FormItemRule, value: any) => {
            // 对于多选组件，需要检查数组是否为空
            if (!value || (Array.isArray(value) && value.length === 0)) {
              return new Error('请至少选择一个分组');
            }
            return true;
          },
        },
      ],
      componentProps: {
        api: NavigationApi.getNavigationGroup,
        labelField: 'name',
        valueField: 'id',
        clearable: true,
        filterable: true,
        multiple: true,
      },
    },
    {
      field: 'path',
      label: '导航链接',
      component: 'NInput',
      required: true,
      rules: [
        {
          type: 'string',
          required: true,
          trigger: ['blur', 'input'],
          validator: (_rule: FormItemRule, value: string) => {
            if (!value) {
              return new Error('请输入导航链接');
            }
            // 简单的URL验证
            const urlPattern = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlPattern.test(value)) {
              return new Error('请输入有效的URL地址（如：https://www.example.com）');
            }
            return true;
          },
        },
      ],
      componentProps: {
        placeholder: '请输入导航链接（如：https://www.example.com）',
      },
    },
    {
      field: 'name',
      label: '导航名称',
      component: 'NInput',
      required: true,
      rules: [
        {
          type: 'string',
          required: true,
          trigger: ['blur', 'input'],
          validator: (_rule: FormItemRule, value: string) => {
            if (!value) {
              return new Error('请输入导航名称');
            }
            if (value.length < 2) {
              return new Error('导航名称长度不能少于2个字符');
            }
            if (value.length > 30) {
              return new Error('导航名称长度不能超过30个字符');
            }
            return true;
          },
        },
      ],
      componentProps: {
        placeholder: '请输入导航名称',
        maxlength: 30,
        showCount: true,
      },
    },
    {
      field: 'icon',
      label: '导航图标',
      slot: 'navigationIcon',
      required: true,
      rules: [
        {
          required: true,
          message: '请选择导航图标',
          trigger: ['blur', 'change'],
        },
      ],
    },
    {
      field: 'description',
      label: '导航描述',
      component: 'NInput',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入导航描述（可选）',
        autosize: { minRows: 2, maxRows: 4 },
        maxlength: 200,
        showCount: true,
      },
    },
    {
      field: 'sortOrder',
      label: '排序',
      component: 'NInputNumber',
      defaultValue: 0,
      componentProps: {
        placeholder: '请输入排序值',
        min: 0,
        max: 9999,
        step: 1,
        precision: 0,
      },
    },
    {
      field: 'status',
      label: '状态',
      component: 'NRadioGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
  ];

  return {
    getFormSchemas,
    getGroupFormSchemas,
    getNavigationFormSchemas,
  };
};
