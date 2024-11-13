import { omit } from 'lodash';

interface TreeNode extends Recordable {
  id: number;
  pid: Nullable<number> | Nullable<number[]>;
}

interface TreeData extends Recordable {
  id: number;
  pid: Nullable<number> | Nullable<number[]>;
  children?: TreeNode[];
}

export function arrayToTree(
  data: TreeNode[],
  parentId: Nullable<number> | Nullable<number[]> = null,
): any[] {
  // 创建一个映射，方便查找每个节点
  const map = new Map();
  data.forEach((item: TreeNode) => map.set(item.id, { ...item, children: [] }));

  // 结果数组，用于存储树结构
  const result: TreeData[] = [];

  // 遍历数组，构建树
  data.forEach((item) => {
    const { id, pid } = item;

    // 如果pid为null，说明是根节点，直接添加到结果数组中
    // 如果没有找到父节点，说明是孤立节点，直接添加到结果数组中
    if (pid === parentId || !map.has(pid)) {
      result.push(map.get(id));
    } else if (map.has(pid)) {
      // 如果找到父节点，添加到父节点的 children 数组中
      map.get(pid).children.push(map.get(id));
    }
  });

  // 将空的 children 数组删除
  const transform = (node: any) => {
    if (node.children.length > 0) {
      return {
        ...node,
        children: node.children.map(transform),
      };
    }
    return omit(node, ['children']);
  };
  return result.map(transform);
}
