import { BlogApi } from '@/api';
import { JayIcon } from '@/components';
import { postStatusColorOptions, postStatusOptions } from '@/constants';
import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { toLower } from 'lodash';
import { NButton, NDropdown, NFlex, NImage, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { computed, ref, Ref } from 'vue';

const locales = (field: string) => $t(`modules.blog.post.${field}`);

export const useBlogSchema = (
  methods: any = {},
  loadingStates: Ref<Record<number, boolean>> = ref({}),
) => {
  const schema = computed(() => ({
    properties: [
      {
        key: 'id',
        label: $t('common.id'),
        defaultValue: undefined,
        form: {
          component: 'NInputNumber',
          componentProps: {
            showButton: false,
            min: 1,
            step: 1,
            precision: 0,
          },
        },
        table: {
          width: 90,
          render: (row: Blog.Post) => {
            return (
              <NFlex items-center vertical>
                <span>{row.id}</span>
                {row.isTop && (
                  <NTag type="success" bordered={false} size="small">
                    {locales('schema.isTop')}
                  </NTag>
                )}
              </NFlex>
            );
          },
        },
        editForm: {
          componentProps: {
            showButton: false,
            disabled: true,
          },
        },
      },
      {
        key: 'coverImage',
        label: $t('modules.blog.post.schema.coverImage'),
        table: {
          width: 130,
          align: 'center',
          render: (row: Blog.Post) => {
            return (
              row.coverImage && (
                <NImage
                  lazy
                  style={{ width: '100%', height: 'auto' }}
                  src={`${row.coverImage}?x-oss-process=image/resize,w_100`}
                  preview-src={`${row.coverImage}`}
                />
              )
            );
          },
        },
      },
      {
        key: 'title',
        label: $t('modules.blog.post.schema.title'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: {
            placeholder: $t('modules.blog.post.schema.pleaseInputTitle'),
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: $t('modules.blog.post.schema.pleaseInputTitle'),
            },
          ],
        },
      },
      {
        key: 'author',
        label: $t('modules.blog.post.schema.author'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
        },
        table: {
          render: (row: Blog.Post) => row.author?.name || row.author?.username || '-',
        },
      },
      {
        key: 'status',
        label: $t('modules.blog.post.schema.status'),
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          componentProps: {
            options: unref(postStatusOptions),
          },
        },
        table: {
          render: (row: Blog.Post) => {
            const status = row.status || 'draft';
            return (
              <NTag type={postStatusColorOptions[toLower(status)]} bordered={false} size="small">
                {locales(`statusMap.${toLower(status)}`)}
              </NTag>
            );
          },
        },
      },
      {
        key: 'category',
        label: $t('modules.blog.post.schema.category'),
        defaultValue: undefined,
        table: {
          align: 'center',
          render: (row: Blog.Post) => {
            const { category } = row;
            return (
              <NSpace vertical inline>
                <div
                  onClick={() => methods.handleSearchCategory(row)}
                  class="flex-x-center p-6px text-sm text-secondary rounded-md bg-[#EEEEEE] hover:bg-[#E0E0E0] transition-all duration-300 cursor-pointer"
                >
                  <JayIcon icon={category?.icon} />
                  <span class="ml-5px" style={{ color: category?.color }}>
                    {category?.name}
                  </span>
                </div>
              </NSpace>
            );
          },
        },
        form: {
          key: 'categoryId',
          component: 'ApiSelect',
          componentProps: {
            api: BlogApi.getCategoryTree,
            multiple: false,
            placeholder: `${$t('common.pleaseSelect')} ${$t('modules.blog.post.schema.category')}`,
            labelField: 'name',
            valueField: 'id',
          },
        },
      },
      {
        key: 'tag',
        label: $t('modules.blog.post.schema.tag'),
        defaultValue: undefined,
        table: {
          render: (row: Blog.Post) => {
            return (
              <NSpace vertical inline>
                {row.tags?.map((tag) => (
                  <div
                    onClick={() => methods.handleSearchTag(tag)}
                    class="flex-x-center px-6px py-4px text-sm text-secondary rounded-md bg-[#EEEEEE] hover:bg-[#E0E0E0] transition-all duration-300 cursor-pointer"
                  >
                    <JayIcon icon={tag?.icon} />
                    <span class="ml-5px" style={{ color: tag?.color }}>
                      {tag?.name}
                    </span>
                  </div>
                ))}
              </NSpace>
            );
          },
        },
        form: {
          key: 'tagIds',
          component: 'ApiSelect',
          componentProps: {
            api: BlogApi.getAllTags,
            multiple: true,
            placeholder: `${$t('common.pleaseSelect')} ${$t('modules.blog.post.schema.tag')}`,
            labelField: 'name',
            valueField: 'id',
          },
        },
      },
      {
        key: 'analysis',
        label: $t('modules.blog.post.schema.analysis'),
        defaultValue: undefined,
        table: {
          render: (row: Blog.Post) => {
            return (
              <NSpace vertical inline>
                <div class="flex-x-center text-primary">
                  <JayIcon icon="twemoji:fire" />
                  <span class="ml-5px lh-18px">浏览：{row.viewCount}</span>
                </div>
                <div class="flex-x-center text-primary">
                  <JayIcon icon="twemoji:thumbs-up" />
                  <span class="ml-5px lh-18px">点赞：{row.likeCount}</span>
                </div>
                <div class="flex-x-center">
                  <JayIcon icon="fxemoji:openbook" />
                  <span class="ml-5px lh-18px">评论：{row.commentCount}</span>
                </div>
              </NSpace>
            );
          },
        },
      },
      {
        key: 'publishedAt',
        label: $t('modules.blog.post.schema.publishedAt'),
        form: {},
        table: {
          width: '120',
          render: (row: Blog.Post) =>
            row.publishedAt ? (
              <div>
                <div>{dayjs(row.publishedAt).format('YYYY-MM-DD')}</div>
                <div>{dayjs(row.publishedAt).format('HH:mm:ss')}</div>
              </div>
            ) : (
              '-'
            ),
        },
      },
      {
        key: 'createdTime',
        label: $t('common.createdTime'),
        defaultValue: undefined,
        table: {
          render: (row: Blog.Post) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'updatedTime',
        label: $t('common.updatedTime'),
        form: {},
        table: {
          // width: '180',
          render: (row: Blog.Post) => dayjs(row.updatedTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'operate',
        label: $t('common.operate'),
        table: {
          width: 200,
          fixed: 'right',
          render: (row: Blog.Post) => {
            // 更多操作菜单选项
            const moreOptions = [
              {
                label:
                  row.status === 'PUBLISHED'
                    ? $t('modules.blog.post.schema.unpublish')
                    : $t('modules.blog.post.schema.publish'),
                key: 'publish',
                icon: () => (
                  <JayIcon
                    icon={
                      row.status === 'PUBLISHED'
                        ? 'material-symbols:unpublished-outline'
                        : 'material-symbols:publish'
                    }
                  />
                ),
                disabled: loadingStates.value[row.id] || false,
              },
              {
                label: row.isTop
                  ? $t('modules.blog.post.schema.untop')
                  : $t('modules.blog.post.schema.top'),
                key: 'top',
                icon: () => (
                  <JayIcon
                    icon={
                      row.isTop ? 'material-symbols:push-pin' : 'material-symbols:push-pin-outline'
                    }
                  />
                ),
                disabled: loadingStates.value[row.id] || false,
              },
            ];

            const handleMoreSelect = (key: string) => {
              switch (key) {
                case 'publish':
                  methods.handlePublish(row);
                  break;
                case 'top':
                  methods.handleToggleTop(row);
                  break;
                default:
                  console.warn('未知的操作类型:', key);
                  break;
              }
            };

            return (
              <NSpace size={8}>
                <NButton type="info" ghost size="small" onClick={() => methods.handleEdit(row)}>
                  {$t('common.edit')}
                </NButton>

                <NPopconfirm
                  onPositiveClick={() => methods.handleDelete(row)}
                  v-slots={{
                    trigger: () => (
                      <NButton type="error" ghost size="small">
                        {$t('common.delete')}
                      </NButton>
                    ),
                  }}
                >
                  {$t('common.phrase.confirmDelete')}?
                </NPopconfirm>

                <NDropdown options={moreOptions} onSelect={handleMoreSelect} trigger="click">
                  <NButton type="default" ghost size="small">
                    更多
                  </NButton>
                </NDropdown>
              </NSpace>
            );
          },
        },
      },
    ],
    // 表格/表单统一配置
    setting: {},
  }));

  // 表格和表单字段
  const tableFields = [
    'id',
    'coverImage',
    'title',
    'author',
    'category',
    'tag',
    'analysis',
    'status',
    'publishedAt',
    // 'createdTime',
    // 'updatedTime',
    'operate',
  ];
  const formFields = ['id', 'type', 'title', 'status', 'content', 'category', 'tag'];
  const editFormFields = ['id', 'title', 'type', 'content'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));

  return { columns, formSchemas, editFormSchemas };
};
