<template>
  <AppPage>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 柱状图 -->
      <n-card title="柱状图示例" :bordered="false" class="h-full">
        <div ref="barChartRef" class="w-full h-80"></div>
      </n-card>

      <!-- 折线图 -->
      <n-card title="折线图示例" :bordered="false" class="h-full">
        <div ref="lineChartRef" class="w-full h-80"></div>
      </n-card>

      <!-- 饼图 -->
      <n-card title="饼图示例" :bordered="false" class="h-full">
        <div ref="pieChartRef" class="w-full h-80"></div>
      </n-card>

      <!-- 散点图 -->
      <n-card title="散点图示例" :bordered="false" class="h-full">
        <div ref="scatterChartRef" class="w-full h-80"></div>
      </n-card>

      <!-- 仪表盘图 -->
      <n-card title="仪表盘图示例" :bordered="false" class="h-full lg:col-span-2">
        <div ref="gaugeChartRef" class="w-full h-80"></div>
      </n-card>
    </div>
  </AppPage>
</template>

<script setup lang="ts">
import { useVChart } from '@/hook/vchart';
import type {
  IBarChartSpec,
  IGaugeChartSpec,
  ILineChartSpec,
  IPieChartSpec,
  IScatterChartSpec,
} from '@visactor/vchart';
import { onMounted } from 'vue';

// DOM 引用
const barChartRef = ref<HTMLElement | null>(null);
const lineChartRef = ref<HTMLElement | null>(null);
const pieChartRef = ref<HTMLElement | null>(null);
const scatterChartRef = ref<HTMLElement | null>(null);
const gaugeChartRef = ref<HTMLElement | null>(null);

/**
 * 柱状图配置 - 展示不同产品的销售数据
 */
const barChartSpec = (): IBarChartSpec => ({
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        { product: 'iPhone 15', sales: 2800, quarter: 'Q1', region: '北美' },
        { product: 'MacBook Pro', sales: 1550, quarter: 'Q1', region: '北美' },
        { product: 'iPad Air', sales: 2430, quarter: 'Q1', region: '北美' },
        { product: 'Apple Watch', sales: 3910, quarter: 'Q1', region: '北美' },
        { product: 'AirPods Pro', sales: 4810, quarter: 'Q1', region: '北美' },
        { product: 'Mac Studio', sales: 1530, quarter: 'Q1', region: '北美' },
        { product: 'HomePod', sales: 890, quarter: 'Q1', region: '北美' },
        { product: 'Apple TV', sales: 1270, quarter: 'Q1', region: '北美' },
      ],
    },
  ],
  xField: 'product',
  yField: 'sales',
  seriesField: 'product',
  axes: [
    {
      orient: 'bottom',
      type: 'band',
      label: {
        style: {
          angle: -45,
          textAlign: 'right',
        },
      },
    },
    {
      orient: 'left',
      type: 'linear',
      title: {
        visible: true,
        text: '销售量 (万台)',
      },
    },
  ],
  label: {
    visible: true,
    formatMethod: (text: string | string[]) => {
      const value = Number(text);
      return `${value}万`;
    },
  },
  tooltip: {
    visible: true,
    mark: {
      title: {
        key: 'product',
        value: 'product',
      },
      content: [
        {
          key: 'sales',
          value: 'sales',
          hasShape: true,
        },
      ],
    },
  },
});

/**
 * 折线图配置 - 展示公司年度收入与支出趋势
 */
const lineChartSpec = (): ILineChartSpec => ({
  type: 'line',
  data: [
    {
      id: 'lineData',
      values: [
        // 收入数据
        { month: '1月', value: 1200, type: '收入', year: '2024' },
        { month: '2月', value: 1350, type: '收入', year: '2024' },
        { month: '3月', value: 1580, type: '收入', year: '2024' },
        { month: '4月', value: 1420, type: '收入', year: '2024' },
        { month: '5月', value: 1680, type: '收入', year: '2024' },
        { month: '6月', value: 1750, type: '收入', year: '2024' },
        { month: '7月', value: 1920, type: '收入', year: '2024' },
        { month: '8月', value: 2100, type: '收入', year: '2024' },
        { month: '9月', value: 1980, type: '收入', year: '2024' },
        { month: '10月', value: 2250, type: '收入', year: '2024' },
        { month: '11月', value: 2180, type: '收入', year: '2024' },
        { month: '12月', value: 2400, type: '收入', year: '2024' },
        // 支出数据
        { month: '1月', value: 890, type: '支出', year: '2024' },
        { month: '2月', value: 1020, type: '支出', year: '2024' },
        { month: '3月', value: 1150, type: '支出', year: '2024' },
        { month: '4月', value: 1080, type: '支出', year: '2024' },
        { month: '5月', value: 1200, type: '支出', year: '2024' },
        { month: '6月', value: 1250, type: '支出', year: '2024' },
        { month: '7月', value: 1380, type: '支出', year: '2024' },
        { month: '8月', value: 1450, type: '支出', year: '2024' },
        { month: '9月', value: 1420, type: '支出', year: '2024' },
        { month: '10月', value: 1580, type: '支出', year: '2024' },
        { month: '11月', value: 1520, type: '支出', year: '2024' },
        { month: '12月', value: 1650, type: '支出', year: '2024' },
        // 利润数据
        { month: '1月', value: 310, type: '利润', year: '2024' },
        { month: '2月', value: 330, type: '利润', year: '2024' },
        { month: '3月', value: 430, type: '利润', year: '2024' },
        { month: '4月', value: 340, type: '利润', year: '2024' },
        { month: '5月', value: 480, type: '利润', year: '2024' },
        { month: '6月', value: 500, type: '利润', year: '2024' },
        { month: '7月', value: 540, type: '利润', year: '2024' },
        { month: '8月', value: 650, type: '利润', year: '2024' },
        { month: '9月', value: 560, type: '利润', year: '2024' },
        { month: '10月', value: 670, type: '利润', year: '2024' },
        { month: '11月', value: 660, type: '利润', year: '2024' },
        { month: '12月', value: 750, type: '利润', year: '2024' },
      ],
    },
  ],
  xField: 'month',
  yField: 'value',
  seriesField: 'type',
  point: {
    visible: true,
    style: {
      size: 4,
      lineWidth: 2,
    },
  },
  line: {
    style: {
      lineWidth: 3,
      lineDash: [0],
    },
  },
  label: {
    visible: false, // 关闭标签以避免图表过于拥挤
  },
  axes: [
    {
      orient: 'bottom',
      type: 'band',
      title: {
        visible: true,
        text: '月份',
      },
    },
    {
      orient: 'left',
      type: 'linear',
      title: {
        visible: true,
        text: '金额 (万元)',
      },
    },
  ],
  legends: {
    visible: true,
    orient: 'top',
  },
  tooltip: {
    visible: true,
    dimension: {
      title: {
        value: (datum: any) => `${datum.month} 财务数据`,
      },
      content: [
        {
          key: 'value',
          value: (datum: any) => `收入: ${datum.value}万元`,
        },
        {
          key: 'value',
          value: (datum: any) => `支出: ${datum.value}万元`,
        },
        {
          key: 'value',
          value: (datum: any) => `利润: ${datum.value}万元`,
        },
      ],
    },
  },
});

/**
 * 饼图配置 - 展示市场份额分布
 */
const pieChartSpec = (): IPieChartSpec => ({
  type: 'pie',
  data: [
    {
      id: 'pieData',
      values: [
        { platform: 'iOS', marketShare: 28.5, users: 285, color: '#1890ff' },
        { platform: 'Android', marketShare: 55.2, users: 552, color: '#52c41a' },
        { platform: 'Windows', marketShare: 8.3, users: 83, color: '#faad14' },
        { platform: 'macOS', marketShare: 4.8, users: 48, color: '#722ed1' },
        { platform: 'Linux', marketShare: 2.1, users: 21, color: '#f5222d' },
        { platform: '其他', marketShare: 1.1, users: 11, color: '#13c2c2' },
      ],
    },
  ],
  categoryField: 'platform',
  valueField: 'marketShare',
  innerRadius: 0.4,
  outerRadius: 0.8,
  padAngle: 0.02,
  label: {
    visible: true,
    position: 'outside',
    formatMethod: (text: string | string[], datum: any) => {
      const value = Number(text);
      return `${datum.platform}\n${value}%`;
    },
    style: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  },
  pie: {
    style: {
      stroke: '#fff',
      lineWidth: 2,
    },
  },
  tooltip: {
    visible: true,
    mark: {
      title: {
        key: 'platform',
        value: 'platform',
      },
      content: [
        {
          key: 'marketShare',
          value: (datum: any) => `市场份额: ${datum.marketShare}%`,
          hasShape: true,
        },
        {
          key: 'users',
          value: (datum: any) => `用户数: ${datum.users}万`,
        },
      ],
    },
  },
  legends: {
    visible: true,
    orient: 'right',
    item: {
      shape: {
        style: {
          symbolType: 'circle',
        },
      },
    },
  },
  title: {
    visible: true,
    text: '操作系统市场份额',
    subtext: '2024年Q1数据',
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    subtextStyle: {
      fontSize: 12,
      fill: '#666',
    },
  },
});

/**
 * 散点图配置 - 展示员工绩效与薪资关系
 */
const scatterChartSpec = (): IScatterChartSpec => ({
  type: 'scatter',
  data: [
    {
      id: 'scatterData',
      values: [
        // 技术部门
        {
          performance: 85,
          salary: 18,
          experience: 3,
          department: '技术部',
          name: '张三',
          size: 300,
        },
        {
          performance: 92,
          salary: 25,
          experience: 5,
          department: '技术部',
          name: '李四',
          size: 500,
        },
        {
          performance: 78,
          salary: 15,
          experience: 2,
          department: '技术部',
          name: '王五',
          size: 200,
        },
        {
          performance: 88,
          salary: 22,
          experience: 4,
          department: '技术部',
          name: '赵六',
          size: 400,
        },
        {
          performance: 95,
          salary: 32,
          experience: 7,
          department: '技术部',
          name: '钱七',
          size: 700,
        },
        {
          performance: 82,
          salary: 19,
          experience: 3,
          department: '技术部',
          name: '孙八',
          size: 300,
        },

        // 销售部门
        {
          performance: 90,
          salary: 28,
          experience: 4,
          department: '销售部',
          name: '周九',
          size: 400,
        },
        {
          performance: 87,
          salary: 24,
          experience: 3,
          department: '销售部',
          name: '吴十',
          size: 300,
        },
        {
          performance: 93,
          salary: 35,
          experience: 6,
          department: '销售部',
          name: '郑一',
          size: 600,
        },
        {
          performance: 75,
          salary: 16,
          experience: 2,
          department: '销售部',
          name: '王二',
          size: 200,
        },
        {
          performance: 89,
          salary: 26,
          experience: 4,
          department: '销售部',
          name: '李三',
          size: 400,
        },
        {
          performance: 84,
          salary: 21,
          experience: 3,
          department: '销售部',
          name: '张四',
          size: 300,
        },

        // 市场部门
        {
          performance: 86,
          salary: 20,
          experience: 3,
          department: '市场部',
          name: '陈五',
          size: 300,
        },
        {
          performance: 91,
          salary: 27,
          experience: 5,
          department: '市场部',
          name: '林六',
          size: 500,
        },
        {
          performance: 79,
          salary: 17,
          experience: 2,
          department: '市场部',
          name: '黄七',
          size: 200,
        },
        {
          performance: 88,
          salary: 23,
          experience: 4,
          department: '市场部',
          name: '刘八',
          size: 400,
        },
        {
          performance: 94,
          salary: 30,
          experience: 6,
          department: '市场部',
          name: '杨九',
          size: 600,
        },
      ],
    },
  ],
  xField: 'performance',
  yField: 'salary',
  seriesField: 'department',
  sizeField: 'size',
  point: {
    style: {
      fillOpacity: 0.8,
      stroke: '#fff',
      lineWidth: 1,
    },
  },
  axes: [
    {
      orient: 'bottom',
      type: 'linear',
      title: {
        visible: true,
        text: '绩效评分',
      },
      min: 70,
      max: 100,
    },
    {
      orient: 'left',
      type: 'linear',
      title: {
        visible: true,
        text: '薪资 (万元)',
      },
      min: 10,
      max: 40,
    },
  ],
  legends: {
    visible: true,
    orient: 'top',
    item: {
      shape: {
        style: {
          symbolType: 'circle',
        },
      },
    },
  },
  tooltip: {
    visible: true,
    mark: {
      title: {
        key: 'name',
        value: 'name',
      },
      content: [
        {
          key: 'department',
          value: (datum: any) => `部门: ${datum.department}`,
          hasShape: true,
        },
        {
          key: 'performance',
          value: (datum: any) => `绩效: ${datum.performance}分`,
        },
        {
          key: 'salary',
          value: (datum: any) => `薪资: ${datum.salary}万元`,
        },
        {
          key: 'experience',
          value: (datum: any) => `工作经验: ${datum.experience}年`,
        },
      ],
    },
  },
  title: {
    visible: true,
    text: '员工绩效与薪资关系分析',
    subtext: '气泡大小表示工作经验',
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    subtextStyle: {
      fontSize: 12,
      fill: '#666',
    },
  },
});

/**
 * 仪表盘图配置 - 展示系统性能监控
 */
const gaugeChartSpec = (): IGaugeChartSpec => ({
  type: 'gauge',
  radiusField: 'value',
  data: [
    {
      id: 'gaugeData',
      values: [
        {
          type: 'CPU使用率',
          value: 75.6,
          target: 80,
          status: 'warning',
        },
      ],
    },
  ],
  categoryField: 'type',
  valueField: 'value',
  innerRadius: 0.4,
  outerRadius: 0.65,
  startAngle: -225,
  endAngle: 45,
  gauge: {
    type: 'circularProgress',
    progress: {
      style: {
        fill: {
          gradient: 'linear',
          x0: 0,
          y0: 0,
          x1: 1,
          y1: 0,
          stops: [
            { offset: 0, color: '#52c41a' },
            { offset: 0.5, color: '#faad14' },
            { offset: 1, color: '#ff4d4f' },
          ],
        },
      },
    },
    track: {
      style: {
        fill: '#f0f0f0',
      },
    },
  },
  pointer: {
    visible: true,
    style: {
      fill: '#666',
    },
  },
  pin: {
    visible: true,
    style: {
      fill: '#666',
      r: 6,
    },
  },
  axes: [
    {
      type: 'linear',
      orient: 'angle',
      min: 0,
      max: 100,
      range: {
        min: -225,
        max: 45,
      },
      tick: {
        visible: true,
        tickCount: 6,
        style: {
          stroke: '#666',
          lineWidth: 2,
        },
      },
      subTick: {
        visible: true,
        tickCount: 4,
        style: {
          stroke: '#999',
          lineWidth: 1,
        },
      },
      label: {
        visible: true,
        style: {
          fontSize: 12,
          fill: '#666',
          fontWeight: 'bold',
        },
        formatMethod: (text: string | string[]) => {
          const value = Number(text);
          return `${value}%`;
        },
      },
    },
  ],
  indicator: [
    {
      visible: true,
      offsetY: -10,
      title: {
        visible: true,
        style: {
          fontSize: 18,
          fontWeight: 'bold',
          fill: '#333',
          text: 'CPU使用率',
        },
      },
      content: [
        {
          visible: true,
          style: {
            fontSize: 32,
            fontWeight: 'bold',
            fill: '#1890ff',
            text: (datum: any) => (datum ? `${datum.value}%` : '0%'),
          },
        },
        {
          visible: true,
          style: {
            fontSize: 14,
            fill: '#666',
            text: (datum: any) => {
              if (!datum) return '未知状态';
              const { value } = datum;
              if (value < 50) return '运行良好';
              if (value < 80) return '运行正常';
              return '负载较高';
            },
          },
        },
      ],
    },
  ],
  title: {
    visible: true,
    text: '系统性能监控',
    subtext: '实时CPU使用率',
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    subtextStyle: {
      fontSize: 12,
      fill: '#666',
    },
  },
  tooltip: {
    visible: true,
    mark: {
      title: {
        key: 'type',
        value: 'type',
      },
      content: [
        {
          key: 'value',
          value: (datum: any) => `当前值: ${datum.value}%`,
          hasShape: true,
        },
        {
          key: 'target',
          value: (datum: any) => `目标值: ${datum.target}%`,
        },
        {
          key: 'status',
          value: (datum: any) => {
            const { value } = datum;
            if (value < 50) return '状态: 优秀';
            if (value < 80) return '状态: 良好';
            return '状态: 警告';
          },
        },
      ],
    },
  },
});

// 初始化图表
const { domRef: barDomRef } = useVChart(barChartSpec);
const { domRef: lineDomRef } = useVChart(lineChartSpec);
const { domRef: pieDomRef } = useVChart(pieChartSpec);
const { domRef: scatterDomRef } = useVChart(scatterChartSpec);
const { domRef: gaugeDomRef } = useVChart(gaugeChartSpec);

// 在组件挂载后设置 DOM 引用
onMounted(() => {
  barDomRef.value = barChartRef.value;
  lineDomRef.value = lineChartRef.value;
  pieDomRef.value = pieChartRef.value;
  scatterDomRef.value = scatterChartRef.value;
  gaugeDomRef.value = gaugeChartRef.value;
});
</script>

<style scoped>
.grid {
  min-height: 100%;
}
</style>
